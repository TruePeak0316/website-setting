import type { AdvantageItem, ArticleSummary, ReviewItem, ServiceSection, TeamMember, TimelineItem } from "@/lib/types";

export const SERVICES: ServiceSection[] = [
  {
    id: "tax-service",
    title: "稅務申報及記帳",
    summary: "讓您放心的稅務後盾，建立穩定帳務制度並降低補稅與裁罰風險。",
    image: "/images/Tax Filling.webp",
    icon: "receipt",
    sections: [
      {
        heading: "為什麼需要這項服務",
        body: ["稅務申報與日常記帳是企業合規經營的基礎。", "錯誤申報或不完整帳冊，可能導致補稅與罰鍰，也會影響銀行信評與查帳風險。"],
      },
      {
        heading: "我們怎麼幫您",
        body: ["每申報月處理營業稅申報。", "依所取得資料編製損益表、資產負債表等基本報表。", "主動提醒稅務申報與繳納時程，協助留存單據與備查資料。"],
      },
      {
        heading: "我們的優勢",
        body: ["會計師親自監控作業品質。", "建立穩定的記帳制度，為企業長期管理奠基。", "不只是報稅，而是以懂經營的會計人角度協助客戶。"],
      },
    ],
  },
  {
    id: "finance-service",
    title: "財務顧問及管理",
    summary: "把財務報表轉譯為經營決策，協助企業看懂現金流與風險。",
    image: "/images/Accounting Management.webp",
    icon: "chart",
    sections: [
      {
        heading: "為什麼需要這項服務",
        body: ["許多中小企業重營運、輕財務，常常有賺錢卻沒有現金，或無法從報表中看出問題與風險。"],
      },
      {
        heading: "我們怎麼幫您",
        body: ["依企業需求提供分析與財務諮詢。", "協助經營者看懂數字、掌握財務體質，做出正確決策。"],
      },
      {
        heading: "我們的優勢",
        body: ["將財務報表轉譯為實用資訊，結合實務經驗給出可行建議。", "溝通方式專業但不艱澀，讓老闆聽得懂、用得上。"],
      },
    ],
  },
  {
    id: "company-setup",
    title: "公司設立與變更",
    summary: "從創業第一步開始，協助設立、資本額簽證與登記事項規劃。",
    image: "/images/Company Establishment and Changes.webp",
    icon: "building",
    sections: [
      {
        heading: "為什麼需要這項服務",
        body: ["從創業設立到未來股權調整、組織變更，每一個登記事項都與稅務、法律、風險責任密切相關。"],
      },
      {
        heading: "我們怎麼幫您",
        body: ["協助公司或行號設立、命名、資本額簽證、章程設計。", "辦理負責人、營業地址、營業項目、股東異動等變更登記。"],
      },
      {
        heading: "我們的優勢",
        body: ["一站式處理，不需自行奔波市政府、國稅局與其他政府單位。", "由會計師直接提供稅務面與風險面的整合建議。", "熟悉創業者需求，流程簡化、報價透明。"],
      },
    ],
  },
  {
    id: "audit-service",
    title: "簽證與審計服務",
    summary: "守護企業公信力與透明度，支援增資、貸款、補助與標案需求。",
    image: "/images/Certification and Audit Services.webp",
    icon: "file",
    sections: [
      {
        heading: "為什麼需要這項服務",
        body: ["不論是增資、貸款、補助或政府標案，許多情境皆需會計師簽證。簽證不只是流程，也是專業聲譽的背書。"],
      },
      {
        heading: "我們怎麼幫您",
        body: ["提供資本額簽證、營所稅查核簽證與財報簽證。", "整合必要憑證、報表與證明文件，確保簽證順利。", "協助預先評估查核風險，提供財報調整與解釋建議。"],
      },
      {
        heading: "我們的優勢",
        body: ["由具有簽證經驗的會計師親自辦理，品質嚴謹。", "不只是制式簽名，而是專業分析與風險說明並重。"],
      },
    ],
  },
  {
    id: "inheritance-tax",
    title: "遺產與贈與稅諮詢及申報",
    summary: "結合法令解析與財務評估，量身打造傳承與節稅安排。",
    image: "/images/estate and gift tax planning and consultation.webp",
    icon: "shield",
    sections: [
      {
        heading: "為什麼需要這項服務",
        body: ["面對資產移轉，若沒有提前規劃，很可能導致高額遺產稅負，甚至家族糾紛。"],
      },
      {
        heading: "我們怎麼幫您",
        body: ["協助盤點資產結構，試算遺產或贈與稅額與節稅方式。", "配合律師、財產規劃師等跨專業團隊，量身打造傳承策略。"],
      },
      {
        heading: "我們的優勢",
        body: ["會計師熟悉實務操作與家庭敏感議題，諮詢溝通細膩。", "不只報稅，而是整體架構與風險評估並重。"],
      },
    ],
  },
];

export const ADVANTAGES: AdvantageItem[] = [
  {
    id: "legacy",
    title: "在地深耕與跨國視野",
    description: "從鶯歌到三峽，累積長期在地服務經驗，也具備四大事務所與跨國審計背景。",
    icon: "globe",
    stat: "1998",
    label: "服務脈絡起點",
  },
  {
    id: "quality",
    title: "會計師親自把關",
    description: "重要案件由會計師直接判斷風險、檢視申報品質，避免服務停留在資料輸入層次。",
    icon: "award",
    stat: "1:1",
    label: "專業諮詢",
  },
  {
    id: "clarity",
    title: "透明溝通與清楚報價",
    description: "以白話說明稅務與財務後果，讓經營者理解每一項服務的內容與價值。",
    icon: "check",
    stat: "清楚",
    label: "流程與費用",
  },
  {
    id: "systems",
    title: "制度化帳務流程",
    description: "協助企業把憑證、申報、報表與內部管理串起來，讓會計成為可持續的經營基礎。",
    icon: "book",
    stat: "SOP",
    label: "帳務制度",
  },
];

export const TIMELINE: TimelineItem[] = [
  {
    year: "1998",
    title: "永聖稅務記帳士事務所創立",
    description: "陳滿景記帳士於新北市鶯歌區創立事務所，以帳務處理與報稅服務起家，奠定紮實的實務基礎。",
  },
  {
    year: "2010",
    title: "遷所三峽，持續深耕",
    description: "事務所遷至新北市三峽區，持續為個體戶與中小企業提供第一線財稅支援。",
  },
  {
    year: "2021",
    title: "彭裕峰會計師加入 KPMG",
    description: "參與上市櫃電子製造業查核、英文專案與美國出差任務，累積國內外查核與風險管理經驗。",
  },
  {
    year: "2023",
    title: "通過會計師考試",
    description: "正式取得執業資格，完成從實務到制度的專業歷程。",
  },
  {
    year: "2024",
    title: "誠峰會計師事務所成立",
    description: "以誠信為本、峰頂為志為核心理念，提供合規、可行且具洞察力的專業服務。",
  },
];

export const TEAM: TeamMember[] = [
  {
    name: "誠峰",
    role: "會計師事務所",
    image: "/images/AboutUs.webp",
    paragraphs: [
      "誠峰會計師事務所由彭裕峰會計師於 2024 年創立，名稱寓意對誠信的堅持與持續追求專業高峰的精神。",
      "我們深信，誠信與專業是會計工作的根本。無論是提出建議還是計費方式，誠峰始終以坦率透明為原則。",
      "誠峰相信，會計不只是報稅與記帳，更是企業走得長遠的重要指南針。",
    ],
  },
  {
    name: "彭裕峰",
    role: "會計師",
    image: "/images/Angus.webp",
    paragraphs: [
      "畢業於國立台北大學會計學系，雙主修應用外語學系，擅長以清晰、溫和的方式協助客戶理解複雜財務議題。",
      "曾任職於 KPMG 安侯建業聯合會計師事務所，服務上市櫃電子製造業，並三度派駐美國參與跨國審計專案。",
      "他相信會計不只是過去的紀錄，而是呈現企業的過去、現在與未來，協助經營者做出有根據的判斷。",
    ],
    highlights: ["KPMG 審計部小組長", "北區國稅局桃園分局遺贈稅值班會計師", "新北市政府經濟發展局值班會計師", "經濟部投資審議司值班會計師"],
  },
  {
    name: "陳滿景",
    role: "記帳士",
    image: "/images/May.webp",
    paragraphs: [
      "擁有三十年實務經驗，專長於中小企業帳務處理與稅務申報。",
      "她長期以細心、穩定與誠懇的服務風格，獲得眾多客戶信任。",
      "目前擔任誠峰會計師事務所的營運顧問，協助團隊提升日常作業、客戶溝通與流程管理品質。",
    ],
  },
];

export const GOOGLE_REVIEWS: ReviewItem[] = [
  {
    author: "Chuan Tsai",
    age: "7 個月前",
    content: "配合這麼長的時間，貴事務所一直是我們不後悔的選擇。不論是稅務規劃或是各式帳務上的問題，都盡心盡力的回覆。很值得推薦給大家。",
  },
  {
    author: "Jacyli Hsieh",
    age: "1 年前",
    content: "個人財務管理對我來說非常重要，很開心能夠找到專業又細心的會計團隊。無論是個人還是公司的業務，服務非常用心、專業且迅速。",
  },
  {
    author: "張美惠",
    age: "7 個月前",
    content: "專業認真的彭會計師及陳記帳士為我解決了很多稅務上的問題，也因為能得到如此優質的事務所幫忙，讓我在節稅規劃上獲益良多。",
  },
  {
    author: "黃仕文",
    age: "6 個月前",
    content: "會計師認真負責，有耐心地解釋相關規範，讓第一次開公司也可以安心。",
  },
  {
    author: "JESSICA Yang",
    age: "1 年前",
    content: "在地服務多年，為公司提供專業的稅務諮詢，以及誠信可靠的規劃，親切的服務態度值得推薦。",
  },
  {
    author: "AJ",
    age: "1 年前",
    content: "Mr. Angus and his team have been instrumental in managing our company finances and growth. They are professional and always ready to answer your questions.",
  },
];

export const ENVIRONMENT_IMAGES = [
  "/images/environment01.webp",
  "/images/environment02.webp",
  "/images/environment03.webp",
  "/images/environment05.webp",
  "/images/environment06.webp",
];

export const ARTICLE_INDEX: ArticleSummary[] = [
  { slug: "014", title: "申報完畢", subtitle: "相關附件上傳", date: "2026-05-25", year: "2026", category: "財稅實務", image: "/Library/PictureOf014.webp", alt: "申報完畢" },
  { slug: "013", title: "執行業務所得申報操作", subtitle: "", date: "2026-05-25", year: "2026", category: "財稅實務", image: "/Library/PictureOf013.webp", alt: "執行業務所得申報操作" },
  { slug: "012", title: "綜合所得稅申報", subtitle: "行號71D", date: "2026-05-25", year: "2026", category: "財稅實務", image: "/Library/PictureOf012.webp", alt: "綜合所得稅申報" },
  { slug: "011", title: "各類所得扣繳常見問題與實務重點一次說清楚", subtitle: "", date: "2026-01-27", year: "2026", category: "財稅實務", image: "/Library/PictureOf011.webp", alt: "各類所得扣繳" },
  { slug: "010", title: "當贈與變成遺產", subtitle: "113年憲判字第11號揭開擬制遺產課稅的憲法爭議(下)", date: "2025-12-12", year: "2025", category: "誠峰解析", image: "/Library/PictureOf010.webp", alt: "遺產稅爭議下篇" },
  { slug: "009", title: "當贈與變成遺產", subtitle: "113年憲判字第11號揭開擬制遺產課稅的憲法爭議(上)", date: "2025-12-12", year: "2025", category: "誠峰解析", image: "/Library/PictureOf009.webp", alt: "遺產稅爭議上篇" },
  { slug: "008", title: "電子發票一定要上傳平台嗎？", subtitle: "什麼資料要上傳？多久內要完成？不上傳會被罰嗎？", date: "2025-12-05", year: "2025", category: "財稅實務", image: "/Library/PictureOf008.webp", alt: "電子發票一定要上傳平台嗎" },
  { slug: "007", title: "何謂扣繳？", subtitle: "到底在繳什麼東西", date: "2025-10-14", year: "2025", category: "財稅實務", image: "/Library/PictureOf007.webp", alt: "何謂扣繳" },
  { slug: "006", title: "網紅課稅新制上路", subtitle: "YouTube、IG、直播收入都要報稅？", date: "2025-10-03", year: "2025", category: "財稅實務", image: "/Library/PictureOf006.webp", alt: "網紅課稅新制上路" },
  { slug: "005", title: "營業稅是什麼？", subtitle: "創業老闆必懂的基礎觀念", date: "2025-09-17", year: "2025", category: "財稅實務", image: "/Library/PictureOf005.webp", alt: "營業稅是什麼" },
  { slug: "004", title: "我要創業", subtitle: "是開公司好還是行號好？", date: "2025-08-29", year: "2025", category: "公司經營", image: "/Library/PictureOf004.webp", alt: "我要創業" },
  { slug: "003", title: "會計也能很永續？", subtitle: "看我們怎麼把 ESG 落實在每一天", date: "2025-07-31", year: "2025", category: "誠峰解析", image: "/Library/PictureOf003.webp", alt: "會計也能很永續" },
  { slug: "002", title: "不能說的秘密:擴大書面審核", subtitle: "從便民到變質，一項福國利民政策，如何拖垮會計產業？", date: "2025-06-30", year: "2025", category: "誠峰解析", image: "/Library/PictureOf002.webp", alt: "不能說的秘密擴大書面審核" },
  { slug: "001", title: "一年不開發票會違法嗎？", subtitle: "談營業稅免用統一發票制度的實務解析", date: "2025-05-31", year: "2025", category: "財稅實務", image: "/Library/PictureOf001.webp", alt: "一年不開發票會違法嗎" },
];
