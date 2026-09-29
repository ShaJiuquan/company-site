import type { Status } from './site';

export const marketing = {
  zh: {
    hero: ['让材料研发，', '沿着样品向前。'],
    heroDescription: '从生长到测量，从分析到仿真。开特云以样品为主线，构建连接仪器、数据与研究工作的数字基础。',
    heroEyebrow: 'MATERIALS R&D / CONNECTED BY SAMPLES',
    heroAction: '探索解决方案', heroSecondary: '讨论你的研发场景',
    heroFootnote: 'DataViewer 开发中 · PPMS 测控内部使用 · Agent 接口规划中',
    industryStrip: ['化合物半导体', '低维量子材料', '高校课题组', '外延 / 器件研发'],
    solutionEyebrow: '01 / SOLUTIONS', solutionTitle: ['让实验连成主线，', '让数据成为线索。'],
    solutionIntro: '样品在仪器之间流转，研发的上下文也应该一起流转。我们的解决方案方向，是让每次生长、每组测量和每张论文图，都能回到同一块样品。',
    solutionAction: '查看解决方案',
    solutionPillars: [
      { title: '样品驱动的数据组织', subtitle: 'SAMPLE-CENTERED DATA', text: '正在建设样品档案、跨设备时间线与分析溯源，让分散的记录围绕样品组织。', status: 'development' as Status, scope: 'DataViewer · alpha' },
      { title: '从仪器到实验流程', subtitle: 'INSTRUMENT TO WORKFLOW', text: '从内部已使用的 PPMS 测控出发，规划 MBE/RHEED 接入，逐步衔接生长与测量。', status: 'available' as Status, scope: '可用范围仅限内部 PPMS 测控' },
      { title: '为 AI 参与科研打基础', subtitle: 'AI-READY BY DESIGN', text: '规划通过 MCP 连接样品库与确定性分析操作，让所有 AI 动作经人工批准并留痕。', status: 'planned' as Status, scope: 'Agent 接口' },
    ],
    industryEyebrow: '02 / INDUSTRIES', industryTitle: ['深入材料实验室，', '理解研发的不同现场。'], industryIntro: '聚焦化合物半导体与低维量子材料，从具体的样品流转和测量场景开始。', industryAction: '探索行业场景',
    industries: [
      { id: 'semiconductors', code: 'COMPOUND SEMICONDUCTORS', title: '化合物半导体', intro: '让外延生长、器件制备与输运测量，在同一条研发主线上汇合。', audience: '外延研发 / 器件研发 / 高校实验室', problem: '生长记录、制备与转移记录、输运数据往往由不同设备和人员分别保存。跨阶段比较时，样品身份与实验条件容易脱节。', direction: '以样品 ID 为索引，围绕生长—制备—测量—分析组织记录，为后续仿真结果的关联预留位置。', scenarios: [
        { text: '样品档案与分析来源关联', status: 'development' as Status },
        { text: 'PPMS 输运测量自动化（内部使用）', status: 'available' as Status },
        { text: 'MBE/RHEED 生长记录接入', status: 'planned' as Status },
      ] },
      { id: 'quantum-materials', code: 'LOW-DIMENSIONAL QUANTUM MATERIALS', title: '低维量子材料', intro: '围绕一块样品的实验历史，组织表征记录、分析过程与研究线索。', audience: '凝聚态研究 / 低维材料 / 高校课题组', problem: '多次制备、转移和表征形成不同版本的数据。整理物性结果与论文图时，常需要在文件夹和个人记录中反复寻找来源。', direction: '正在以样品档案和时间线为基础，组织原始数据、处理与拟合步骤，保留结果与样品历史之间的关联。', scenarios: [
        { text: '跨设备数据时间线', status: 'development' as Status },
        { text: '处理、拟合与全程溯源', status: 'development' as Status },
        { text: '人工批准的 AI 样品库访问', status: 'planned' as Status },
      ] },
    ],
    trendEyebrow: '03 / WHAT’S NEXT', trendTitle: '面向 AI for Science，\n先把实验连接起来。', trendIntro: 'AI 参与科研、实验自动化、可追溯数据，是我们关注的三个方向。开特云从材料实验室的数据与仪器基础出发，逐步推进。',
    trends: [
      { keyword: 'AI for Science', title: '让 AI 接触有上下文的数据', text: '我们规划的 Agent 接口，将围绕样品库、确定性分析操作与人工批准展开。', status: 'planned' as Status },
      { keyword: 'Laboratory Automation', title: '让自动化落到真实的测控环节', text: 'PPMS 测控已在内部使用；生长设备的接入是后续规划方向。', status: 'available' as Status },
      { keyword: 'Data Provenance', title: '让研究结论保留来路', text: 'DataViewer 正在开发样品、原始数据和处理步骤之间的溯源关联。', status: 'development' as Status },
    ],
    productEyebrow: '04 / PRODUCT FOUNDATION', productTitle: '让解决方案，有具体落点。', productIntro: '三块产品支撑同一条主线。以当前进展为边界，逐步连接实验室。',
    solutionsPage: { eyebrow: 'SOLUTIONS / 解决方案', title: '连接实验的每一环。\n从样品开始。', intro: '开特云面向材料实验室，构建以样品为主线的研发数字基础。仪器测控、数据组织与规划中的 AI 接口，沿着同一条实验主线协同推进。', challenge: '从分散记录到研发线索', challengeText: '仪器软件各自记录测量，个人电脑各自保存分析。真正需要连接的，是一块样品跨越生长、制备、测量、分析与仿真的完整上下文。', pathwayTitle: '三个建设方向', pathwayNote: '解决方案是持续建设的方向，具体能力以所列状态和产品说明为准。', localTitle: '以本地优先，贴近实验现场。', localText: 'DataViewer 正在采用本地优先设计，目标是让数据留在实验室。规划中的 Agent 接口将要求所有 AI 动作经人工批准并留痕。', localFeatures: [{ text: 'DataViewer 本地优先设计', status: 'development' as Status }, { text: 'AI 动作批准与留痕', status: 'planned' as Status }] },
    industriesPage: { eyebrow: 'INDUSTRIES / 行业场景', title: '不同研究现场，\n同一条样品主线。', intro: '面向化合物半导体与低维量子材料研发，关注高校课题组和外延、器件企业研发部门的具体工作流程。', challenge: '现场的问题', direction: '解决方案方向', scenario: '相关能力与状态', disclaimer: '以下为面向行业的方案方向与应用场景，未表示已交付行业项目或拥有客户案例。' },
    contactTitle: ['把下一步研发，', '建立在清晰的数据之上。'],
  },
  en: {
    hero: ['Move materials R&D', 'forward. Sample by sample.'],
    heroDescription: 'From growth to measurement. From analysis to simulation. 开特云 is building a sample-centered digital foundation for instruments, data, and research workflows.',
    heroEyebrow: 'MATERIALS R&D / CONNECTED BY SAMPLES',
    heroAction: 'Explore solutions', heroSecondary: 'Discuss your R&D workflow',
    heroFootnote: 'DataViewer in development · PPMS in internal use · Agent interface planned',
    industryStrip: ['Compound semiconductors', 'Quantum materials', 'Research groups', 'Epitaxy / Device R&D'],
    solutionEyebrow: '01 / SOLUTIONS', solutionTitle: ['Connect the experiment.', 'Keep the research context.'],
    solutionIntro: 'As a sample moves between instruments, its research context should move with it. Our solution direction links growth records, measurements, and paper figures back to the same sample.',
    solutionAction: 'Explore our approach',
    solutionPillars: [
      { title: 'Data organized around samples', subtitle: 'SAMPLE-CENTERED DATA', text: 'Sample records, cross-instrument timelines, and analysis provenance are being developed to organize scattered records around each sample.', status: 'development' as Status, scope: 'DataViewer · alpha' },
      { title: 'From instruments to workflows', subtitle: 'INSTRUMENT TO WORKFLOW', text: 'Starting with PPMS control in internal use, MBE/RHEED integration is planned to connect growth and measurement records over time.', status: 'available' as Status, scope: 'Available scope: internal PPMS control only' },
      { title: 'A foundation for AI in research', subtitle: 'AI-READY BY DESIGN', text: 'A planned MCP interface would connect sample records and deterministic analysis, with human approval and records for every AI action.', status: 'planned' as Status, scope: 'Agent interface' },
    ],
    industryEyebrow: '02 / INDUSTRIES', industryTitle: ['Close to the laboratory.', 'Focused on materials R&D.'], industryIntro: 'Focused on compound semiconductors and low-dimensional quantum materials, starting with real sample and measurement workflows.', industryAction: 'Explore industry scenarios',
    industries: [
      { id: 'semiconductors', code: 'COMPOUND SEMICONDUCTORS', title: 'Compound semiconductors', intro: 'Bring epitaxy, device preparation, and transport measurements into one research thread.', audience: 'Epitaxy R&D / Device R&D / University labs', problem: 'Growth, fabrication, transfer, and transport measurement records are often kept by different tools and people. Sample identity and experimental conditions can become disconnected across stages.', direction: 'Use a sample ID to organize growth, preparation, measurement, and analysis records, with room to associate simulation results later.', scenarios: [
        { text: 'Sample records linked to analysis sources', status: 'development' as Status },
        { text: 'PPMS transport measurement automation (internal use)', status: 'available' as Status },
        { text: 'MBE/RHEED growth record integration', status: 'planned' as Status },
      ] },
      { id: 'quantum-materials', code: 'LOW-DIMENSIONAL QUANTUM MATERIALS', title: 'Low-dimensional quantum materials', intro: 'Organize characterization records, analysis steps, and research context around each sample’s experimental history.', audience: 'Condensed matter / Low-dimensional materials / Research groups', problem: 'Repeated preparation, transfer, and characterization create many versions of data. Tracing physical-property results and paper figures often means searching folders and personal notes.', direction: 'Sample records and timelines are being developed to connect raw data, processing, and fitting steps with each sample’s history.', scenarios: [
        { text: 'Cross-instrument data timelines', status: 'development' as Status },
        { text: 'Processing, fitting, and provenance', status: 'development' as Status },
        { text: 'Human-approved AI access to sample records', status: 'planned' as Status },
      ] },
    ],
    trendEyebrow: '03 / WHAT’S NEXT', trendTitle: 'AI for Science starts\nwith connected experiments.', trendIntro: 'AI in research, laboratory automation, and traceable data are three directions we focus on. Our approach starts with the data and instrument foundations of materials laboratories.',
    trends: [
      { keyword: 'AI for Science', title: 'Give AI access to context', text: 'The planned Agent interface would connect sample records and deterministic analysis with human approval.', status: 'planned' as Status },
      { keyword: 'Laboratory Automation', title: 'Start with real instrument workflows', text: 'PPMS control is in internal use. Growth instrument integration remains a planned direction.', status: 'available' as Status },
      { keyword: 'Data Provenance', title: 'Keep the lineage behind a conclusion', text: 'DataViewer is being developed to link samples, raw data, and processing steps.', status: 'development' as Status },
    ],
    productEyebrow: '04 / PRODUCT FOUNDATION', productTitle: 'A concrete foundation for the approach.', productIntro: 'Three products support one digital thread, with progress bounded by each product’s actual current status.',
    solutionsPage: { eyebrow: 'SOLUTIONS', title: 'Connect every stage.\nStart with the sample.', intro: '开特云 is building a sample-centered digital foundation for materials laboratories. Instrument control, data organization, and a planned AI interface develop along one experimental thread.', challenge: 'From scattered records to research context', challengeText: 'Instrument software records measurements. Personal computers hold analysis files. What needs connecting is the context of one sample across growth, preparation, measurement, analysis, and simulation.', pathwayTitle: 'Three directions for development', pathwayNote: 'These solution directions are being developed. Actual capabilities are limited to the stated status and product descriptions.', localTitle: 'Local-first. Close to the experiment.', localText: 'DataViewer is being developed with a local-first design intended to keep data inside the laboratory. The planned Agent interface would require human approval and records for every AI action.', localFeatures: [{ text: 'DataViewer local-first design', status: 'development' as Status }, { text: 'AI action approval and records', status: 'planned' as Status }] },
    industriesPage: { eyebrow: 'INDUSTRIES', title: 'Different research settings.\nOne sample-centered thread.', intro: 'Focused on compound semiconductor and low-dimensional quantum materials R&D, for university research groups and epitaxy and device R&D teams.', challenge: 'The workflow challenge', direction: 'Our solution direction', scenario: 'Related capabilities & status', disclaimer: 'These are intended industry scenarios and solution directions, not claims of delivered industry projects or customer case studies.' },
    contactTitle: ['Build the next research step', 'on a clearer data foundation.'],
  },
};
