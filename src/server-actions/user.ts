"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";
import bcrypt from "bcryptjs";
import { getUserId, getSession } from "./get-session";
import { triggerDatabaseMail } from "@/lib/mail-service";
import { getUserInvitationEmailHtml } from "@/lib/email-builder";
import { generateRandomPassword } from "@/lib/utils";

export async function getUsers() {
  return await dbQuery(
    prisma.user.findMany({
      include: {
        appSuiteEmployeeMaster: true,
        company: true
      },
      orderBy: { createdOn: "desc" }
    })
  )
}

export async function getUserById(id: number): Promise<{ data: UserInfoPayload | null, error: any }> {
  return await dbQuery(
    prisma.user.findUnique({
      where: { id },
      include: userInfoInclude
    })
  )
}

export async function getEscalations() {
  return await dbQuery(
    prisma.user.findMany({
      where: { isEscalation: true },
      include: {
        appSuiteEmployeeMaster: true,
        company: true
      },
      orderBy: { createdOn: "desc" }
    })
  )
}

export async function getEscalationUser(search: string = "", skip: number = 0) {
  return await dbQuery(
    prisma.user.findMany({
      where: {
        isEscalation: true,
        OR: [
          { appSuiteEmployeeMaster: { firstName: { contains: search } } },
          { appSuiteEmployeeMaster: { lastName: { contains: search } } },
          { employeeNumber: { contains: search } }
        ],
      },
      select: {
        id: true,
        employeeNumber: true,
        appSuiteEmployeeMaster: {
          select: {
            firstName: true,
            lastName: true,
            fullName: true
          }
        }
      },
      take: 20,
      skip: skip,
      orderBy: { appSuiteEmployeeMaster: { lastName: 'asc' } }
    })
  )
}

export async function createUser(formData: any) {
  const currentUserId = await getUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }

  const {
    employeeNumber,
    username,
    emailAddress,
    companyId,
    roleIds,
    groupIds,
    projectIds,
    escalations,
    isEscalation,
    currentUser = currentUserId
  } = formData

  const genPassword = generateRandomPassword(8)
  const hashedPassword = await bcrypt.hash(genPassword, 10)

  const { data: newUser, error } = await dbQuery(
    prisma.$transaction(async (tx) => {
      // 1. Create the User
      const newUser = await tx.user.create({
        data: {
          employeeNumber,
          username,
          password: hashedPassword,
          emailAddress,
          companyId: companyId ? Number(companyId) : null,
          isEscalation,
          createdBy: currentUser,
          escalation1: escalations.first?.id || null,
          escalation2: escalations.second?.id || null,
          escalation3: escalations.third?.id || null,
          escalation4: escalations.fourth?.id || null,

          // 2. Create UserRoles
          userRoles: {
            create: roleIds.map((rId: number) => ({
              role: {
                connect: { id: rId }
              },
              creator: {
                connect: { id: currentUser }
              }
            }))
          },

          // 3. Create UserGroups
          userGroups: {
            create: groupIds.map((gId: number) => ({
              group: {
                connect: { id: gId }
              },
              creator: {
                connect: { id: currentUser }
              }
            }))
          },

          // 4. Create UserProjects
          userProjects: {
            create: projectIds.map((pId: number) => ({
              project: {
                connect: { id: pId }
              },
              creator: {
                connect: { id: currentUser }
              }
            }))
          },

        },
        include: userInfoInclude
      })

      return newUser
    })
  )

  if (newUser) {
    const emailHtml = await getUserInvitationEmailHtml({newUser, password: genPassword})
    triggerDatabaseMail({
      to: emailHtml.recipient,
      subject: emailHtml.subject,
      body: emailHtml.template
    }).catch(err => console.error("Background Email Error:", err))
  }

  if (error) { return { newUser, error } }
  revalidatePath("/qas/admin/users");
  return { newUser, error }
}

export async function updateUser(userId: number, formData: any) {
  const currentUserId = await getUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }

  const {
    username,
    emailAddress,
    companyId,
    roleIds,
    groupIds,
    projectIds,
    escalations,
    isEscalation,
    isActive,
    currentUser = currentUserId
  } = formData

  const { data, error } = await dbQuery(
    prisma.$transaction(async (tx) => {
      // 1. Update basic user info
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          username,
          emailAddress,
          companyId: companyId ? Number(companyId) : null,
          isEscalation,
          escalation1: escalations.first?.id || null,
          escalation2: escalations.second?.id || null,
          escalation3: escalations.third?.id || null,
          escalation4: escalations.fourth?.id || null,
          isActive,
        }
      })

      // 2. Sync and upsert selected roles
      await tx.userRole.updateMany({
        where: { userId: userId },
        data: { isActive: false }
      })

      for (const rId of roleIds) {
        await tx.userRole.upsert({
          where: {
            userId_roleId: { userId: userId, roleId: rId }
          },
          update: { isActive: true },
          create: {
            user: { connect: { id: userId } },
            role: { connect: { id: rId } },
            creator: { connect: { id: currentUser } }
          }
        })
      }

      // 3. Sync and upsert selected groups
      await tx.userGroup.updateMany({
        where: { userId: userId },
        data: { isActive: false }
      })

      for (const gId of groupIds) {
        await tx.userGroup.upsert({
          where: {
            userId_groupId: { userId: userId, groupId: gId }
          },
          update: { isActive: true },
          create: {
            user: { connect: { id: userId } },
            group: { connect: { id: gId } },
            creator: { connect: { id: currentUser } }
          }
        })
      }

      // 4. Sync and upset selected projects
      await tx.userProject.updateMany({
        where: { userId: userId },
        data: { isActive: false }
      })

      for (const pId of projectIds) {
        await tx.userProject.upsert({
          where: {
            userId_projectId: { userId: userId, projectId: pId }
          },
          update: { isActive: true },
          create: {
            user: { connect: { id: userId } },
            project: { connect: { id: pId } },
            creator: { connect: { id: currentUser } }
          }
        })

        return user
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/qas/admin/users");
  return { data, error }
}

export async function getActiveComplianceOfficers(): Promise<{ data: UserBasicPayload[] | null, error: any }> {
  return await dbQuery(
    prisma.user.findMany({
      where: {
        isActive: true,
        userRoles: {
          some: { roleId: 1003, isActive: true }
        }
      },
      select: userBasicSelect
    })
  )
}

export async function getActiveSupervisors(): Promise<{ data: UserBasicPayload[] | null, error: any }> {
  return await dbQuery(
    prisma.user.findMany({
      where: {
        isActive: true,
        userRoles: {
          some: { roleId: 1002, isActive: true }
        }
      },
      select: userBasicSelect
    })
  )
}

export async function getActiveRecipients(): Promise<{ data: UserBasicPayload[] | null, error: any }> {
  return await dbQuery(
    prisma.user.findMany({
      where: {
        isActive: true,
        userRoles: {
          some: { roleId: 1004, isActive: true }
        }
      },
      select: userBasicSelect
    })
  )
}

export async function activateAccount(newPassword: string) {
  const session = await getSession()
  const userId = session?.user.id

  if (!userId) {
    return { data: null, error: "You must be logged in to activate your account." };
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: { password: true }
  })

  if (!user) {
    return { data: null, error: "User account not found." }
  }

  if (user.password) {
    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      return { data: null, error: "PASSWORD_SAME_AS_CURRENT" }
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  return await dbQuery(
    prisma.user.update({
      where: {
        id: Number(session.user.id)
      },
      data: {
        password: hashedPassword,
        isActivated: true
      }
    })
  )
}

// user payload
const escalationSelect = {
  select: {
    id: true,
    appSuiteEmployeeMaster: { select: { fullName: true, employeeNumber: true } }
  }
}

const userInfoInclude = {
  appSuiteEmployeeMaster: {
    select: { fullName: true, firstName: true, lastName: true, position: true, emailAddress: true, employeeNumber: true }
  },
  userRoles: {
    where: { isActive: true },
    select: { role: { select: { id: true } } },
  },
  userGroups: {
    where: { isActive: true },
    select: { group: { select: { id: true, name: true, isActive: true } } }
  },
  userProjects: {
    where: { isActive: true },
    select: { project: { select: { id: true, name: true, isActive: true } } }
  },
  escalation1User: escalationSelect,
  escalation2User: escalationSelect,
  escalation3User: escalationSelect,
  escalation4User: escalationSelect,
} satisfies Prisma.UserInclude;

const userBasicSelect = {
  id: true,
  employeeNumber: true,
  emailAddress: true,
  username: true,
  escalation1User: escalationSelect,
  escalation2User: escalationSelect,
  escalation3User: escalationSelect,
  escalation4User: escalationSelect,
  appSuiteEmployeeMaster: {
    select: { fullName: true }
  },
  company: {
    select: { id: true, name: true }
  },
  userGroups: {
    where: { isActive: true },
    select: { groupId: true }
  },
  userProjects: {
    where: { isActive: true },
    select: { projectId: true }
  }
} satisfies Prisma.UserSelect;

export type UserInfoPayload = Prisma.UserGetPayload<{
  include: typeof userInfoInclude
}>

export type UserBasicPayload = Prisma.UserGetPayload<{
  select: typeof userBasicSelect
}>