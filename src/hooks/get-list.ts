"use client"
import { useEffect, useState } from "react"
import { Transaction } from "@/app/qas/columns";

export async function useDataServer(): Promise<Transaction[]> {
  const res = await fetch("/qas-list-sample.json");
  const json = await res.json();
  
  return json.map((item: any) => ({
    id: item.JobTransactionId,
    auditNo: item.AuditFindingNumber,
    company: item.CompanyName,
    project: item.ProjectDepartmentName,
    resposiblePerson: item.ResponsiblePerson,
    status: item.JobStatus.toLowerCase(),
    engagement: item.EngagementName,
    rating: item.RatingName,
    category: item.CategoryName,
    details: item.ProblemDescription,
    approvedDate: item.ApprovedDate || "",
  }));

}


export function useDataClient() {
  const [data, setData] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch("/qas-list-sample.json")
      .then((res) => res.json())
      .then((json) => {
        const mappedData = json.map((item: any) => ({
          id: item.JobTransactionId,
          auditNo: item.AuditFindingNumber,
          company: item.CompanyName,
          project: item.ProjectDepartmentName,
          resposiblePerson: item.ResponsiblePerson,
          status: item.Status,
          secondaryStatus: item.SecondaryStatus,
          engagement: item.EngagementName,
          rating: item.RatingName,
          category: item.CategoryName,
          details: item.ProblemDescription,
          approvedDate: item.ApprovedDate || "",
        }));
        setData(mappedData);
      });
  }, []);

  return data;
}

export function useRecord(id?: string) {
  const [data, setData] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch("/qas-list-sample.json")
      .then((res) => res.json())
      .then((json) => {
        const mappedData = json.map((item: any) => ({
          id: item.JobTransactionId,
          auditNo: item.AuditFindingNumber,
          company: item.CompanyName,
          project: item.ProjectDepartmentName,
          resposiblePerson: item.ResponsiblePerson,
          status: item.JobStatus.toLowerCase(),
          engagement: item.EngagementName,
          rating: item.RatingName,
          category: item.CategoryName,
          details: item.ProblemDescription,
          approvedDate: item.ApprovedDate || "",
        }));

        const filtered = id
          ? mappedData.filter((record: Transaction) => record.id === id) 
          : mappedData;

        setData(filtered);
      });
  }, [id]);

  return data;
}