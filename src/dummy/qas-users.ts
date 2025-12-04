import User from "@/lib/user";

const users: User[] = [
  { id: "U001", empId: "EMP001", username: "jdoe1", firstname: "John", lastname: "Doe", status: "Active", email: "jdoe1@example.com", accesslevel: "Admin", company: "Acme Corp" },
  { id: "U002", empId: "EMP002", username: "asmith2", firstname: "Alice", lastname: "Smith", status: "Inactive", email: "asmith2@example.com", accesslevel: "Compliance Secretariat", company: "Globex" },
  { id: "U003", empId: "EMP003", username: "bwayne3", firstname: "Bruce", lastname: "Wayne", status: "Active", email: "bwayne3@example.com", accesslevel: "Compliance Officer", company: "Wayne Enterprises" },
  { id: "U004", empId: "EMP004", username: "ckent4", firstname: "Clark", lastname: "Kent", status: "Active", email: "ckent4@example.com", accesslevel: "Supervisor", company: "Daily Planet" },
  { id: "U005", empId: "EMP005", username: "dprince5", firstname: "Diana", lastname: "Prince", status: "Active", email: "dprince5@example.com", accesslevel: "Recipient", company: "Themyscira" },

  { id: "U006", empId: "EMP006", username: "pparker6", firstname: "Peter", lastname: "Parker", status: "Inactive", email: "pparker6@example.com", accesslevel: "Admin", company: "Daily Bugle" },
  { id: "U007", empId: "EMP007", username: "tstark7", firstname: "Tony", lastname: "Stark", status: "Active", email: "tstark7@example.com", accesslevel: "Compliance Secretariat", company: "Stark Industries" },
  { id: "U008", empId: "EMP008", username: "srogers8", firstname: "Steve", lastname: "Rogers", status: "Active", email: "srogers8@example.com", accesslevel: "Compliance Officer", company: "S.H.I.E.L.D." },
  { id: "U009", empId: "EMP009", username: "nbarton9", firstname: "Natasha", lastname: "Romanoff", status: "Active", email: "nromanoff9@example.com", accesslevel: "Supervisor", company: "S.H.I.E.L.D." },
  { id: "U010", empId: "EMP010", username: "bbaner10", firstname: "Bruce", lastname: "Banner", status: "Inactive", email: "bbaner10@example.com", accesslevel: "Recipient", company: "Gamma Labs" },

  { id: "U011", empId: "EMP011", username: "hpotter11", firstname: "Harry", lastname: "Potter", status: "Active", email: "hpotter11@example.com", accesslevel: "Admin", company: "Hogwarts" },
  { id: "U012", empId: "EMP012", username: "hgranger12", firstname: "Hermione", lastname: "Granger", status: "Active", email: "hgranger12@example.com", accesslevel: "Compliance Secretariat", company: "Hogwarts" },
  { id: "U013", empId: "EMP013", username: "rweasley13", firstname: "Ron", lastname: "Weasley", status: "Inactive", email: "rweasley13@example.com", accesslevel: "Compliance Officer", company: "Hogwarts" },
  { id: "U014", empId: "EMP014", username: "ddursley14", firstname: "Dudley", lastname: "Dursley", status: "Active", email: "ddursley14@example.com", accesslevel: "Supervisor", company: "Grunnings" },
  { id: "U015", empId: "EMP015", username: "ssnape15", firstname: "Severus", lastname: "Snape", status: "Active", email: "ssnape15@example.com", accesslevel: "Recipient", company: "Hogwarts" },

  { id: "U016", empId: "EMP016", username: "jwick16", firstname: "John", lastname: "Wick", status: "Inactive", email: "jwick16@example.com", accesslevel: "Admin", company: "The Continental" },
  { id: "U017", empId: "EMP017", username: "neoper17", firstname: "Neo", lastname: "Anderson", status: "Active", email: "neoper17@example.com", accesslevel: "Compliance Secretariat", company: "Matrix" },
  { id: "U018", empId: "EMP018", username: "trinity18", firstname: "Trinity", lastname: "Moss", status: "Active", email: "trinity18@example.com", accesslevel: "Compliance Officer", company: "Matrix" },
  { id: "U019", empId: "EMP019", username: "mmorpheus19", firstname: "Morpheus", lastname: "Fishburne", status: "Active", email: "mmorpheus19@example.com", accesslevel: "Supervisor", company: "Matrix" },
  { id: "U020", empId: "EMP020", username: "sconnor20", firstname: "Sarah", lastname: "Connor", status: "Inactive", email: "sconnor20@example.com", accesslevel: "Recipient", company: "Cyberdyne Systems" },

  { id: "U021", empId: "EMP021", username: "rachel21", firstname: "Rachel", lastname: "Green", status: "Active", email: "rgreen21@example.com", accesslevel: "Admin", company: "Bloomingdale's" },
  { id: "U022", empId: "EMP022", username: "rross22", firstname: "Ross", lastname: "Geller", status: "Inactive", email: "rgeller22@example.com", accesslevel: "Compliance Secretariat", company: "NY Museum" },
  { id: "U023", empId: "EMP023", username: "mchan23", firstname: "Monica", lastname: "Geller", status: "Active", email: "mgeller23@example.com", accesslevel: "Compliance Officer", company: "Javu" },
  { id: "U024", empId: "EMP024", username: "cbing24", firstname: "Chandler", lastname: "Bing", status: "Active", email: "cbing24@example.com", accesslevel: "Supervisor", company: "Yemen Corp" },
  { id: "U025", empId: "EMP025", username: "jtrib25", firstname: "Joey", lastname: "Tribbiani", status: "Active", email: "jtribbiani25@example.com", accesslevel: "Recipient", company: "Days of Our Lives" },

  { id: "U026", empId: "EMP026", username: "mfrost26", firstname: "Michael", lastname: "Frost", status: "Inactive", email: "mfrost26@example.com", accesslevel: "Admin", company: "Acme Corp" },
  { id: "U027", empId: "EMP027", username: "kstone27", firstname: "Kara", lastname: "Stone", status: "Active", email: "kstone27@example.com", accesslevel: "Compliance Secretariat", company: "Globex" },
  { id: "U028", empId: "EMP028", username: "rfields28", firstname: "Riley", lastname: "Fields", status: "Active", email: "rfields28@example.com", accesslevel: "Compliance Officer", company: "Wayne Enterprises" },
  { id: "U029", empId: "EMP029", username: "tquinn29", firstname: "Taylor", lastname: "Quinn", status: "Active", email: "tquinn29@example.com", accesslevel: "Supervisor", company: "Daily Planet" },
  { id: "U030", empId: "EMP030", username: "jrivera30", firstname: "Jamie", lastname: "Rivera", status: "Inactive", email: "jrivera30@example.com", accesslevel: "Recipient", company: "Themyscira" },

  { id: "U031", empId: "EMP031", username: "cnavarro31", firstname: "Casey", lastname: "Navarro", status: "Active", email: "cnavarro31@example.com", accesslevel: "Admin", company: "Stark Industries" },
  { id: "U032", empId: "EMP032", username: "mgarcia32", firstname: "Morgan", lastname: "Garcia", status: "Inactive", email: "mgarcia32@example.com", accesslevel: "Compliance Secretariat", company: "S.H.I.E.L.D." },
  { id: "U033", empId: "EMP033", username: "rcruz33", firstname: "Riley", lastname: "Cruz", status: "Active", email: "rcruz33@example.com", accesslevel: "Compliance Officer", company: "Gamma Labs" },
  { id: "U034", empId: "EMP034", username: "alogan34", firstname: "Avery", lastname: "Logan", status: "Active", email: "alogan34@example.com", accesslevel: "Supervisor", company: "Hogwarts" },
  { id: "U035", empId: "EMP035", username: "cameron35", firstname: "Cameron", lastname: "Santos", status: "Active", email: "csantos35@example.com", accesslevel: "Recipient", company: "Grunnings" },

  { id: "U036", empId: "EMP036", username: "drew36", firstname: "Drew", lastname: "Reyes", status: "Inactive", email: "dreyes36@example.com", accesslevel: "Admin", company: "Acme Corp" },
  { id: "U037", empId: "EMP037", username: "quinn37", firstname: "Quinn", lastname: "Cruz", status: "Active", email: "qcruz37@example.com", accesslevel: "Compliance Secretariat", company: "Globex" },
  { id: "U038", empId: "EMP038", username: "rowan38", firstname: "Rowan", lastname: "Garcia", status: "Active", email: "rgarcia38@example.com", accesslevel: "Compliance Officer", company: "Wayne Enterprises" },
  { id: "U039", empId: "EMP039", username: "logan39", firstname: "Logan", lastname: "Ramos", status: "Active", email: "lramos39@example.com", accesslevel: "Supervisor", company: "Daily Planet" },
  { id: "U040", empId: "EMP040", username: "sky40", firstname: "Sky", lastname: "Torres", status: "Inactive", email: "storres40@example.com", accesslevel: "Recipient", company: "Themyscira" },

  { id: "U041", empId: "EMP041", username: "evan41", firstname: "Evan", lastname: "Mendoza", status: "Active", email: "emendoza41@example.com", accesslevel: "Admin", company: "Stark Industries" },
  { id: "U042", empId: "EMP042", username: "micah42", firstname: "Micah", lastname: "Flores", status: "Inactive", email: "mflores42@example.com", accesslevel: "Compliance Secretariat", company: "S.H.I.E.L.D." },
  { id: "U043", empId: "EMP043", username: "hayden43", firstname: "Hayden", lastname: "De Guzman", status: "Active", email: "hdeguzman43@example.com", accesslevel: "Compliance Officer", company: "Gamma Labs" },
  { id: "U044", empId: "EMP044", username: "reese44", firstname: "Reese", lastname: "Navarro", status: "Active", email: "rnavarro44@example.com", accesslevel: "Supervisor", company: "Hogwarts" },
  { id: "U045", empId: "EMP045", username: "blake45", firstname: "Blake", lastname: "Pineda", status: "Active", email: "bpineda45@example.com", accesslevel: "Recipient", company: "Grunnings" },

  { id: "U046", empId: "EMP046", username: "parker46", firstname: "Parker", lastname: "Rivera", status: "Inactive", email: "privera46@example.com", accesslevel: "Admin", company: "Acme Corp" },
  { id: "U047", empId: "EMP047", username: "alex47", firstname: "Alex", lastname: "Villanueva", status: "Active", email: "avillanueva47@example.com", accesslevel: "Compliance Secretariat", company: "Globex" },
  { id: "U048", empId: "EMP048", username: "jamie48", firstname: "Jamie", lastname: "Del Rosario", status: "Active", email: "jdelrosario48@example.com", accesslevel: "Compliance Officer", company: "Wayne Enterprises" },
  { id: "U049", empId: "EMP049", username: "taylor49", firstname: "Taylor", lastname: "Aquino", status: "Active", email: "taquino49@example.com", accesslevel: "Supervisor", company: "Daily Planet" },
  { id: "U050", empId: "EMP050", username: "jordan50", firstname: "Jordan", lastname: "Bautista", status: "Inactive", email: "jbautista50@example.com", accesslevel: "Recipient", company: "Themyscira" },

  { id: "U051", empId: "EMP051", username: "casey51", firstname: "Casey", lastname: "Domingo", status: "Active", email: "cdomingo51@example.com", accesslevel: "Admin", company: "Stark Industries" },
  { id: "U052", empId: "EMP052", username: "morgan52", firstname: "Morgan", lastname: "Martinez", status: "Inactive", email: "mmartinez52@example.com", accesslevel: "Compliance Secretariat", company: "S.H.I.E.L.D." },
  { id: "U053", empId: "EMP053", username: "riley53", firstname: "Riley", lastname: "Silva", status: "Active", email: "rsilva53@example.com", accesslevel: "Compliance Officer", company: "Gamma Labs" },
  { id: "U054", empId: "EMP054", username: "avery54", firstname: "Avery", lastname: "Castillo", status: "Active", email: "acastillo54@example.com", accesslevel: "Supervisor", company: "Hogwarts" },
  { id: "U055", empId: "EMP055", username: "cameron55", firstname: "Cameron", lastname: "Santos", status: "Active", email: "csantos55@example.com", accesslevel: "Recipient", company: "Grunnings" },

  { id: "U056", empId: "EMP056", username: "drew56", firstname: "Drew", lastname: "Reyes", status: "Inactive", email: "dreyes56@example.com", accesslevel: "Admin", company: "Acme Corp" },
  { id: "U057", empId: "EMP057", username: "quinn57", firstname: "Quinn", lastname: "Cruz", status: "Active", email: "qcruz57@example.com", accesslevel: "Compliance Secretariat", company: "Globex" },
  { id: "U058", empId: "EMP058", username: "rowan58", firstname: "Rowan", lastname: "Garcia", status: "Active", email: "rgarcia58@example.com", accesslevel: "Compliance Officer", company: "Wayne Enterprises" },
  { id: "U059", empId: "EMP059", username: "logan59", firstname: "Logan", lastname: "Ramos", status: "Active", email: "lramos59@example.com", accesslevel: "Supervisor", company: "Daily Planet" },
  { id: "U060", empId: "EMP060", username: "sky60", firstname: "Sky", lastname: "Torres", status: "Inactive", email: "storres60@example.com", accesslevel: "Recipient", company: "Themyscira" },

  { id: "U061", empId: "EMP061", username: "evan61", firstname: "Evan", lastname: "Mendoza", status: "Active", email: "emendoza61@example.com", accesslevel: "Admin", company: "Stark Industries" },
  { id: "U062", empId: "EMP062", username: "micah62", firstname: "Micah", lastname: "Flores", status: "Inactive", email: "mflores62@example.com", accesslevel: "Compliance Secretariat", company: "S.H.I.E.L.D." },
  { id: "U063", empId: "EMP063", username: "hayden63", firstname: "Hayden", lastname: "De Guzman", status: "Active", email: "hdeguzman63@example.com", accesslevel: "Compliance Officer", company: "Gamma Labs" },
  { id: "U064", empId: "EMP064", username: "reese64", firstname: "Reese", lastname: "Navarro", status: "Active", email: "rnavarro64@example.com", accesslevel: "Supervisor", company: "Hogwarts" },
  { id: "U065", empId: "EMP065", username: "blake65", firstname: "Blake", lastname: "Pineda", status: "Active", email: "bpineda65@example.com", accesslevel: "Recipient", company: "Grunnings" },

  { id: "U066", empId: "EMP066", username: "parker66", firstname: "Parker", lastname: "Rivera", status: "Inactive", email: "privera66@example.com", accesslevel: "Admin", company: "Acme Corp" },
  { id: "U067", empId: "EMP067", username: "alex67", firstname: "Alex", lastname: "Villanueva", status: "Active", email: "avillanueva67@example.com", accesslevel: "Compliance Secretariat", company: "Globex" },
  { id: "U068", empId: "EMP068", username: "jamie68", firstname: "Jamie", lastname: "Del Rosario", status: "Active", email: "jdelrosario68@example.com", accesslevel: "Compliance Officer", company: "Wayne Enterprises" },
  { id: "U069", empId: "EMP069", username: "taylor69", firstname: "Taylor", lastname: "Aquino", status: "Active", email: "taquino69@example.com", accesslevel: "Supervisor", company: "Daily Planet" },
  { id: "U070", empId: "EMP070", username: "jordan70", firstname: "Jordan", lastname: "Bautista", status: "Inactive", email: "jbautista70@example.com", accesslevel: "Recipient", company: "Themyscira" },

  { id: "U071", empId: "EMP071", username: "casey71", firstname: "Casey", lastname: "Domingo", status: "Active", email: "cdomingo71@example.com", accesslevel: "Admin", company: "Stark Industries" },
  { id: "U072", empId: "EMP072", username: "morgan72", firstname: "Morgan", lastname: "Martinez", status: "Inactive", email: "mmartinez72@example.com", accesslevel: "Compliance Secretariat", company: "S.H.I.E.L.D." },
  { id: "U073", empId: "EMP073", username: "riley73", firstname: "Riley", lastname: "Silva", status: "Active", email: "rsilva73@example.com", accesslevel: "Compliance Officer", company: "Gamma Labs" },
  { id: "U074", empId: "EMP074", username: "avery74", firstname: "Avery", lastname: "Castillo", status: "Active", email: "acastillo74@example.com", accesslevel: "Supervisor", company: "Hogwarts" },
  { id: "U075", empId: "EMP075", username: "cameron75", firstname: "Cameron", lastname: "Santos", status: "Active", email: "csantos75@example.com", accesslevel: "Recipient", company: "Grunnings" },

  { id: "U076", empId: "EMP076", username: "drew76", firstname: "Drew", lastname: "Reyes", status: "Inactive", email: "dreyes76@example.com", accesslevel: "Admin", company: "Acme Corp" },
  { id: "U077", empId: "EMP077", username: "quinn77", firstname: "Quinn", lastname: "Cruz", status: "Active", email: "qcruz77@example.com", accesslevel: "Compliance Secretariat", company: "Globex" },
  { id: "U078", empId: "EMP078", username: "rowan78", firstname: "Rowan", lastname: "Garcia", status: "Active", email: "rgarcia78@example.com", accesslevel: "Compliance Officer", company: "Wayne Enterprises" },
  { id: "U079", empId: "EMP079", username: "logan79", firstname: "Logan", lastname: "Ramos", status: "Active", email: "lramos79@example.com", accesslevel: "Supervisor", company: "Daily Planet" },
  { id: "U080", empId: "EMP080", username: "sky80", firstname: "Sky", lastname: "Torres", status: "Inactive", email: "storres80@example.com", accesslevel: "Recipient", company: "Themyscira" },

  { id: "U081", empId: "EMP081", username: "evan81", firstname: "Evan", lastname: "Mendoza", status: "Active", email: "emendoza81@example.com", accesslevel: "Admin", company: "Stark Industries" },
  { id: "U082", empId: "EMP082", username: "micah82", firstname: "Micah", lastname: "Flores", status: "Inactive", email: "mflores82@example.com", accesslevel: "Compliance Secretariat", company: "S.H.I.E.L.D." },
  { id: "U083", empId: "EMP083", username: "hayden83", firstname: "Hayden", lastname: "De Guzman", status: "Active", email: "hdeguzman83@example.com", accesslevel: "Compliance Officer", company: "Gamma Labs" },
  { id: "U084", empId: "EMP084", username: "reese84", firstname: "Reese", lastname: "Navarro", status: "Active", email: "rnavarro84@example.com", accesslevel: "Supervisor", company: "Hogwarts" },
  { id: "U085", empId: "EMP085", username: "blake85", firstname: "Blake", lastname: "Pineda", status: "Active", email: "bpineda85@example.com", accesslevel: "Recipient", company: "Grunnings" },

  { id: "U086", empId: "EMP086", username: "parker86", firstname: "Parker", lastname: "Rivera", status: "Inactive", email: "privera86@example.com", accesslevel: "Admin", company: "Acme Corp" },
  { id: "U087", empId: "EMP087", username: "alex87", firstname: "Alex", lastname: "Villanueva", status: "Active", email: "avillanueva87@example.com", accesslevel: "Compliance Secretariat", company: "Globex" },
  { id: "U088", empId: "EMP088", username: "jamie88", firstname: "Jamie", lastname: "Del Rosario", status: "Active", email: "jdelrosario88@example.com", accesslevel: "Compliance Officer", company: "Wayne Enterprises" },
  { id: "U089", empId: "EMP089", username: "taylor89", firstname: "Taylor", lastname: "Aquino", status: "Active", email: "taquino89@example.com", accesslevel: "Supervisor", company: "Daily Planet" },
  { id: "U090", empId: "EMP090", username: "jordan90", firstname: "Jordan", lastname: "Bautista", status: "Inactive", email: "jbautista90@example.com", accesslevel: "Recipient", company: "Themyscira" },

  { id: "U091", empId: "EMP091", username: "casey91", firstname: "Casey", lastname: "Domingo", status: "Active", email: "cdomingo91@example.com", accesslevel: "Admin", company: "Stark Industries" },
  { id: "U092", empId: "EMP092", username: "morgan92", firstname: "Morgan", lastname: "Martinez", status: "Inactive", email: "mmartinez92@example.com", accesslevel: "Compliance Secretariat", company: "S.H.I.E.L.D." },
  { id: "U093", empId: "EMP093", username: "riley93", firstname: "Riley", lastname: "Silva", status: "Active", email: "rsilva93@example.com", accesslevel: "Compliance Officer", company: "Gamma Labs" },
  { id: "U094", empId: "EMP094", username: "avery94", firstname: "Avery", lastname: "Castillo", status: "Active", email: "acastillo94@example.com", accesslevel: "Supervisor", company: "Hogwarts" },
  { id: "U095", empId: "EMP095", username: "cameron95", firstname: "Cameron", lastname: "Santos", status: "Active", email: "csantos95@example.com", accesslevel: "Recipient", company: "Grunnings" },

  { id: "U096", empId: "EMP096", username: "drew96", firstname: "Drew", lastname: "Reyes", status: "Inactive", email: "dreyes96@example.com", accesslevel: "Admin", company: "Acme Corp" },
  { id: "U097", empId: "EMP097", username: "quinn97", firstname: "Quinn", lastname: "Cruz", status: "Active", email: "qcruz97@example.com", accesslevel: "Compliance Secretariat", company: "Globex" },
  { id: "U098", empId: "EMP098", username: "rowan98", firstname: "Rowan", lastname: "Garcia", status: "Active", email: "rgarcia98@example.com", accesslevel: "Compliance Officer", company: "Wayne Enterprises" },
  { id: "U099", empId: "EMP099", username: "logan99", firstname: "Logan", lastname: "Ramos", status: "Active", email: "lramos99@example.com", accesslevel: "Supervisor", company: "Daily Planet" },
  { id: "U100", empId: "EMP100", username: "sky100", firstname: "Sky", lastname: "Torres", status: "Inactive", email: "storres100@example.com", accesslevel: "Recipient", company: "Themyscira" },
];


export default users;