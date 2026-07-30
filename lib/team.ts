export interface TeamContactLink {
  label: string;
  href: string;
}

export interface TeamProfile {
  slug: string;
  name: string;
  role: string;
  image: string;
  imagePosition?: string;
  qualifications: readonly string[];
  education: readonly string[];
  experience: readonly string[];
  specialties: readonly string[];
  contact?: {
    phone?: TeamContactLink;
    email?: TeamContactLink;
  };
}

export const PENG_YU_FENG_PROFILE: TeamProfile = {
  slug: "peng-yu-feng",
  name: "彭裕峰",
  role: "主持會計師",
  image: "/images/彭裕峰.jpg",
  qualifications: ["中華民國會計師高考及格"],
  education: ["國立台北大學會計系學士", "國立台北大學應用外語系學士"],
  experience: [
    "安侯建業聯合會計師事務所審計部小組長",
    "北區國稅局桃園分局遺贈稅值班會計師",
    "新北市政府經濟發展局值班會計師",
    "經濟部投資審議司值班會計師",
    "中華會審財稅專業協會會員",
    "會計師公會國際暨兩岸服務委員會成員",
  ],
  specialties: [
    "稅務與帳務整合規劃",
    "財務報表查核簽證與稅務簽證",
    "公司設立與投資架構規劃",
    "節稅策略與稅務風險評估",
    "內控制度與帳務流程建置",
    "專業諮詢與其他確信服務",
  ],
  contact: {
    phone: {
      label: "02-86720074",
      href: "tel:0286720074",
    },
    email: {
      label: "anguspeng@tpcpa.com.tw",
      href: "mailto:anguspeng@tpcpa.com.tw",
    },
  },
};

export const CHEN_MAN_JING_PROFILE: TeamProfile = {
  slug: "chen-man-jing",
  name: "陳滿景",
  role: "主持記帳士（營運顧問）",
  image: "/images/chen-man-jing.jpg",
  imagePosition: "center 24%",
  qualifications: ["第一屆記帳士考試及格", "財政部核准執業記帳士"],
  education: ["臺北商業專科學校企業管理科畢業"],
  experience: [
    "1985年投入稅務會計工作",
    "1998年創立永聖會計事務所",
    "2006年取得記帳士證書",
    "2006年更名為永聖稅務記帳士事務所",
    "2010年遷址三峽執業",
    "財稅實務經驗40餘年",
    "長期服務客戶近200家",
  ],
  specialties: [
    "公司設立及工商登記",
    "記帳服務與帳務處理",
    "營業稅申報",
    "營利事業所得稅申報",
    "綜合所得稅申報",
    "財稅規劃與稅務諮詢",
    "中小企業財務管理",
    "創業輔導與經營諮詢",
  ],
};

export const TEAM_PROFILES: readonly TeamProfile[] = [
  PENG_YU_FENG_PROFILE,
  CHEN_MAN_JING_PROFILE,
];
