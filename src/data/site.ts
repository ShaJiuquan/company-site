export type Language = 'zh' | 'en';
export type Page = 'home' | 'solutions' | 'industries' | 'products' | 'about' | 'contact';
export type Status = 'available' | 'development' | 'planned';

// The three editable identity fields. Keep unknown values in {{...}} form.
export const company = {
  name: '开特云',
  team: '{{团队介绍}}',
  email: '{{联系邮箱}}',
};

export const statusLabels = {
  zh: { available: '可用', development: '开发中', planned: '规划中' },
  en: { available: 'Available', development: 'In development', planned: 'Planned' },
};

export const content = {
  zh: {
    nav: { home: '首页', solutions: '解决方案', industries: '行业场景', products: '产品进展', about: '关于', contact: '联系' },
    skip: '跳到正文', menu: '导航菜单', theme: '切换亮暗主题', light: '切换为亮色', dark: '切换为暗色',
    otherLanguage: 'English', languageLabel: 'Switch to English',
    description: '开特云面向化合物半导体与低维量子材料研发实验室，建设以样品为主线的数据工作台、仪器测控与 Agent 接口。各产品状态如实标注。',
    tagline: '材料实验室的数字主线——仪器直连、样品为主线、分析与仿真挂线、每一步可追溯。',
    hero: ['从一块样品，', '看见完整实验。'],
    heroNote: '产品体系持续开发中 · 功能状态见产品页',
    explore: '了解产品', contactUs: '联系我们',
    audience: '面向化合物半导体 / 低维量子材料研发实验室',
    audienceDetail: '高校课题组 · 外延与器件企业研发部门',
    sample: '样品为主线', sampleId: '样品 ID', schematic: '概念示意 / 非产品界面',
    visualCaption: '让分散的实验记录，沿着同一个样品 ID 连接。',
    principles: [
      { title: '以样品组织', text: '从设备文件回到样品档案', status: 'development' as Status },
      { title: '数据留在实验室', text: 'DataViewer 的本地优先设计', status: 'development' as Status },
      { title: 'AI 动作经人工批准', text: 'Agent 接口的设计原则', status: 'planned' as Status },
    ],
    workflowEyebrow: '01 / DIGITAL THREAD',
    workflowTitle: ['实验有先后，', '数据应有来路。'],
    workflowText: '一块样品从生长、制备到测量，再到分析和仿真。数据却常散落在厂商软件和个人电脑中，难以按样品追溯，论文图与审计数据也难以说明来源。',
    workflowNote: '这是目标工作流示意；各环节的实际接入能力与开发状态，请见产品说明。',
    steps: [
      { title: '生长', detail: 'MBE / RHEED' },
      { title: '制备', detail: '加工 / 转移' },
      { title: '测量', detail: 'PPMS / SPM' },
      { title: '分析', detail: '处理 / 拟合' },
      { title: '仿真', detail: '模型 / 结果' },
    ],
    threadCaption: '同一个样品 ID，串起每一步实验记录',
    productsEyebrow: '02 / PRODUCTS', productsTitle: '三块产品，一条主线。',
    productsIntro: '围绕实验室真实工作，逐步连接样品、仪器与分析。每项功能的当前状态都在这里。',
    details: '查看产品说明',
    contactEyebrow: 'LET’S CONNECT', contactTitle: ['从你的实验流程，', '开始聊起。'],
    contactText: '欢迎交流样品追溯、仪器测控与分析流程中的具体需求。',
    footerText: '让实验记录回到样品。', footerNote: '产品能力以所标注的当前状态为准。',
    productPage: { eyebrow: 'PRODUCTS / 产品', title: '能力说清楚，\n状态看得见。', intro: '从样品档案到仪器测控，再到规划中的 Agent 接口。这里说明每块产品解决的问题、工作方式与当前进展。', problem: '解决什么问题', how: '怎么工作', state: '当前状态', features: '功能与状态', legend: '可用指下方说明的使用范围；开发中与规划中功能不代表已交付。' },
    aboutPage: { eyebrow: 'ABOUT / 关于开特云', title: '围绕样品，\n理解实验室。', intro: '我们关注化合物半导体与低维量子材料研发中的数据连续性：从样品出生，到论文图和仿真结果，都能找到记录的来路。', teamTitle: '团队介绍', teamNote: '团队介绍将在确认后补充。', scopeTitle: '我们关注的实验室', scopeText: '高校课题组，以及外延与器件企业的研发部门。我们从样品流转、仪器测控和分析流程中的具体问题出发。', approachTitle: '当前工作方向', approachText: 'DataViewer 处于 alpha 开发阶段；PPMS 测控已在实验室内部使用。MBE/RHEED 接入与 Agent 接口处于规划阶段。', valuesTitle: '做事的边界', values: ['功能按真实状态说明。', 'DataViewer 采用本地优先的设计方向。', '规划中的 AI 操作将需要人工批准并留痕。'] },
    contactPage: { eyebrow: 'CONTACT / 联系开特云', title: '把实验里的问题，\n带到这里。', intro: '如果你正在整理样品档案、接入测量设备或追溯分析结果，欢迎通过邮件交流具体流程。', emailTitle: '邮件联系', emailAction: '写一封邮件', placeholder: '联系邮箱待确认，当前为占位符。', topicsTitle: '可以从这些问题开始', topics: ['一块样品的生长、制备和测量记录现在放在哪里？', '哪些仪器步骤需要自动化，哪些操作应由人确认？', '论文图和分析结果需要保留哪些来源与处理记录？'], note: '此页面仅提供邮件联系入口。' },
    products: [
      { id: 'dataviewer', number: '01', name: 'DataViewer', label: '样品数据工作台', status: 'development' as Status, phase: 'alpha', summary: '以样品为中心，整理跨设备数据与分析记录。', problem: '样品记录分散在设备软件、文件夹与个人电脑里，分析结果难以回溯到原始数据和处理步骤。', how: '正在围绕样品档案构建跨设备时间线，并开发处理、拟合与工作流功能，将来源和处理步骤关联到样品。采用本地优先设计，目标是让数据留在实验室。', state: '开发中（alpha）。所列功能仍在开发，不代表已经完整交付或开放使用。', features: [
        { text: '样品档案', status: 'development' as Status },
        { text: '跨设备数据时间线', status: 'development' as Status },
        { text: '处理 / 拟合 / 工作流', status: 'development' as Status },
        { text: '全程溯源', status: 'development' as Status },
        { text: '本地优先 · 数据不出实验室', status: 'development' as Status },
      ] },
      { id: 'instrument-workbench', number: '02', name: 'Instrument Workbench', label: '仪器测控', status: 'available' as Status, phase: '实验室内部', summary: 'PPMS 测控已内部使用，MBE/RHEED 接入规划中。', problem: '输运测量中的重复操作，以及生长和测量设备各自独立的记录方式，增加了实验流程整理的负担。', how: 'PPMS 输运测量自动化已在实验室内部使用。MBE/RHEED 接入仍处于规划阶段，计划逐步关联生长与测量记录。', state: '可用范围：实验室内部的 PPMS 测控。MBE/RHEED 为规划中；SPM 接入及其他仪器能力尚未承诺。', features: [
        { text: 'PPMS 输运测量自动化（实验室内部）', status: 'available' as Status },
        { text: 'MBE 接入', status: 'planned' as Status },
        { text: 'RHEED 接入', status: 'planned' as Status },
      ] },
      { id: 'agent-interface', number: '03', name: 'Agent 接口', label: '人工批准的 AI 访问', status: 'planned' as Status, phase: '', summary: '计划通过 MCP 连接样品库与确定性分析操作。', problem: 'AI 助手参与实验数据工作时，需要明确的访问边界、可复现的分析操作，以及可核对的动作记录。', how: '计划让 Claude/Codex 等 AI 助手通过 MCP 访问实验室样品库和确定性分析操作。所有 AI 动作都将需要人工批准并留痕。', state: '规划中。MCP 接口、样品库访问、分析操作与批准留痕机制均尚未交付。', features: [
        { text: 'MCP 接口', status: 'planned' as Status },
        { text: '样品库访问', status: 'planned' as Status },
        { text: '确定性分析操作', status: 'planned' as Status },
        { text: '所有 AI 动作人工批准并留痕', status: 'planned' as Status },
      ] },
    ],
  },
  en: {
    nav: { home: 'Home', solutions: 'Solutions', industries: 'Industries', products: 'Products', about: 'About', contact: 'Contact' },
    skip: 'Skip to content', menu: 'Navigation menu', theme: 'Toggle color theme', light: 'Switch to light theme', dark: 'Switch to dark theme',
    otherLanguage: '中文', languageLabel: '切换到中文',
    description: '开特云 develops sample-centered data tools, instrument control, and a planned Agent interface for compound semiconductor and low-dimensional quantum materials laboratories. Product status is clearly stated.',
    tagline: 'A digital thread for materials laboratories: direct instrument connections, samples at the center, linked analysis and simulation, and traceable steps.',
    hero: ['One sample.', 'The whole experiment.'],
    heroNote: 'Product system in development · See individual feature status',
    explore: 'Explore products', contactUs: 'Get in touch',
    audience: 'For compound semiconductor & low-dimensional quantum materials labs',
    audienceDetail: 'University research groups · Epitaxy & device R&D teams',
    sample: 'Sample-centered', sampleId: 'Sample ID', schematic: 'Concept diagram / not a product UI',
    visualCaption: 'Connect scattered experimental records through a shared sample ID.',
    principles: [
      { title: 'Organized by sample', text: 'From device files to a sample record', status: 'development' as Status },
      { title: 'Data stays in the lab', text: 'DataViewer’s local-first design', status: 'development' as Status },
      { title: 'Human-approved AI actions', text: 'A principle of the planned Agent interface', status: 'planned' as Status },
    ],
    workflowEyebrow: '01 / DIGITAL THREAD',
    workflowTitle: ['Experiments have a sequence.', 'Data needs a lineage.'],
    workflowText: 'A sample moves through growth, preparation, measurement, analysis, and simulation. Its records often remain scattered across vendor software and personal computers, making sample history, paper figures, and audit data hard to trace.',
    workflowNote: 'This diagram shows the intended workflow. See product descriptions for current integration capabilities and development status.',
    steps: [
      { title: 'Growth', detail: 'MBE / RHEED' },
      { title: 'Preparation', detail: 'Fabrication / transfer' },
      { title: 'Measurement', detail: 'PPMS / SPM' },
      { title: 'Analysis', detail: 'Processing / fitting' },
      { title: 'Simulation', detail: 'Models / results' },
    ],
    threadCaption: 'One sample ID connects each experimental record',
    productsEyebrow: '02 / PRODUCTS', productsTitle: 'Three products. One thread.',
    productsIntro: 'Connecting samples, instruments, and analysis step by step, around actual laboratory work. Each feature has an explicit status.',
    details: 'Product details',
    contactEyebrow: 'LET’S CONNECT', contactTitle: ['Start with your', 'laboratory workflow.'],
    contactText: 'Let’s discuss specific needs in sample traceability, instrument control, and analysis workflows.',
    footerText: 'Bring experimental records back to the sample.', footerNote: 'Capabilities are limited to their stated current status.',
    productPage: { eyebrow: 'PRODUCTS', title: 'Clear capabilities.\nVisible progress.', intro: 'From sample records and instrument control to a planned Agent interface. See what each product addresses, how it works, and where it stands.', problem: 'The problem', how: 'How it works', state: 'Current status', features: 'Features & status', legend: '“Available” refers only to the scope described below. Features in development or planned are not delivered capabilities.' },
    aboutPage: { eyebrow: 'ABOUT 开特云', title: 'Understand the lab.\nStart with the sample.', intro: 'We focus on continuity in compound semiconductor and low-dimensional quantum materials research: connecting a sample’s origins with the records behind figures and simulation results.', teamTitle: 'Our team', teamNote: 'Team information will be added once confirmed.', scopeTitle: 'The laboratories we focus on', scopeText: 'University research groups and R&D teams in epitaxy and device companies. We start with concrete needs in sample movement, instrument control, and analysis workflows.', approachTitle: 'Current direction', approachText: 'DataViewer is in alpha development. PPMS instrument control is in internal laboratory use. MBE/RHEED integration and the Agent interface are planned.', valuesTitle: 'Our working boundaries', values: ['State each feature’s actual status.', 'Develop DataViewer with a local-first design.', 'Require human approval and action records in the planned AI interface.'] },
    contactPage: { eyebrow: 'CONTACT', title: 'Bring us the questions\nfrom your laboratory.', intro: 'If you are organizing sample records, connecting measurement equipment, or tracing analysis results, email us about your workflow.', emailTitle: 'Contact by email', emailAction: 'Write an email', placeholder: 'The contact email is awaiting confirmation and is currently a placeholder.', topicsTitle: 'A few places to start', topics: ['Where do you keep growth, preparation, and measurement records for a sample?', 'Which instrument steps need automation, and which need human confirmation?', 'What sources and processing records should accompany figures and analysis results?'], note: 'This page provides an email contact link only.' },
    products: [
      { id: 'dataviewer', number: '01', name: 'DataViewer', label: 'Sample data workspace', status: 'development' as Status, phase: 'alpha', summary: 'Sample-centered organization of cross-instrument data and analysis records.', problem: 'Sample records are scattered across instrument software, folders, and personal computers. Analysis results are difficult to trace back to raw data and processing steps.', how: 'Development centers on sample records and cross-instrument timelines, with processing, fitting, and workflows being built to link sources and operations to each sample. The local-first design aims to keep data inside the laboratory.', state: 'In development (alpha). All listed features are under development and are not represented as fully delivered or publicly available.', features: [
        { text: 'Sample records', status: 'development' as Status },
        { text: 'Cross-instrument data timeline', status: 'development' as Status },
        { text: 'Processing / fitting / workflows', status: 'development' as Status },
        { text: 'End-to-end provenance', status: 'development' as Status },
        { text: 'Local-first · data stays in the lab', status: 'development' as Status },
      ] },
      { id: 'instrument-workbench', number: '02', name: 'Instrument Workbench', label: 'Instrument control', status: 'available' as Status, phase: 'Internal lab use', summary: 'PPMS control is in internal use. MBE/RHEED integration is planned.', problem: 'Repetitive transport measurement operations and separate growth and measurement records add friction to laboratory workflows.', how: 'PPMS transport measurement automation is in internal laboratory use. MBE/RHEED integration is still planned, with the intention of linking growth and measurement records over time.', state: 'Available scope: PPMS control inside the laboratory. MBE/RHEED integration is planned. SPM integration and other instrument capabilities have not been committed.', features: [
        { text: 'PPMS transport measurement automation (internal lab use)', status: 'available' as Status },
        { text: 'MBE integration', status: 'planned' as Status },
        { text: 'RHEED integration', status: 'planned' as Status },
      ] },
      { id: 'agent-interface', number: '03', name: 'Agent interface', label: 'Human-approved AI access', status: 'planned' as Status, phase: '', summary: 'A planned MCP connection to sample records and deterministic analysis operations.', problem: 'AI assistants in laboratory data workflows need defined access boundaries, reproducible analysis operations, and reviewable action records.', how: 'The planned interface would let AI assistants such as Claude/Codex access laboratory sample records and deterministic analysis operations through MCP. Every AI action would require human approval and a recorded history.', state: 'Planned. MCP endpoints, sample record access, analysis operations, and approval and logging mechanisms have not been delivered.', features: [
        { text: 'MCP interface', status: 'planned' as Status },
        { text: 'Sample record access', status: 'planned' as Status },
        { text: 'Deterministic analysis operations', status: 'planned' as Status },
        { text: 'Human approval and records for every AI action', status: 'planned' as Status },
      ] },
    ],
  },
};
