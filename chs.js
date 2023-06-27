/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com
 @idle games : http://www.gityx.com
 @QQ Group : 627141737

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Save': '保存',
    'Export': '导出',
    'Import': '导入',
    'Settings': '设置',
    'Achievements': '成就',
    'Statistics': '统计',
    'Changelog': '更新日志',
    'Hotkeys': '快捷键',
    'ALL': '全部',
    'Default': '默认',
    'AUTO': '自动',
    'default': '默认',
    "points": "点数",
    "Reset for +": "重置得到 + ",
    "Currently": "当前",
    "Effect": "效果",
    "Cost": "成本",
    "Goal:": "目标:",
    "Reward": "奖励",
    "Start": "开始",
    "Exit Early": "提前退出",
    "Finish": "完成",
    "Milestone Gotten!": "获得里程碑！",
    "Milestones": "里程碑",
    "Completed": "已完成",
    "Default Save": "默认存档",
    "Delete": "删除",
    "No": "否",
    "Saves": "存档",
    "Options": "选项",
    "Yes": "是",
    "Are you sure?": "你确定吗？",
    "Edit Name": "编辑名称",
    "Info": "信息",
    "Currently:": "当前:",
    "Appearance": "外观",
    "How the game looks.": "游戏看起来如何。",
    "Theme": "主题",
    "Show milestones": "显示里程碑",
    "Show TPS meter at the bottom-left corner of the page.": "在页面左下角显示 TPS。",
    "Show TPS": "显示 TPS",
    "None": "无",
    "Align modifier units": "对齐概览单位",
    "Align numbers to the beginning of the unit in modifier view.": "在概览视图中将数字与单元的开头对齐。",
    "Select which milestones to display based on criterias.": "根据标准选择要显示的里程碑。",
    "All": "全部",
    "Classic": "经典",
    "Configurable": "可配置",
    "Duplicate": "复制",
    "Home": "首页",
    "(+1 thought)": "（+1 想法）",
    "/s": "/秒",
    "Home": "首页",
    "Light": "浅色",
    "Reset": "重置",
    "Think": "思考",
    "thought": "思考",
    "times": "次",
    "You": "你",
    "\"I think, therefore I am.\"": "\“我思故我在。\”",
    "Boost": "提升",
    "Learn to think": "学会思考",
    "once": "1次",
    "per second.": "每秒。",
    "thoughts": "想法",
    "You think": "您思考",
    "\"I dont want to spam click a gazillion times to play ur game\"": "“我不想垃圾邮件点击无数次来玩你的游戏”",
    "\"If you no longer go for a production multiplier that exists, you're no longer an incrementalist.\"": "“如果你不再寻求现有的生产乘数，那么你就不再是增量主义者。”",
    "Accelerate your thinking": "加速你的思考",
    "Boost your thinking": "提升你的思维",
    "Cheese": "奶酪",
    "Instead of thinking once when you click, you gain a production multiplier temporarily.": "您点击时不再思考一次，而是暂时获得生产乘数。",
    "Mechanic": "机械",
    "Really makes you think...": "确实让你觉得...",
    "Simple Maths": "简单的数学",
    "The land of cheese": "奶酪之国",
    "Thought Acceleration": "思维加速",
    "Travel to Switzerland": "前往瑞士",
    "Unlock": "解锁",
    "Unlock the upgrade": "解锁升级",
    "You can start producing": "就可以开始制作了",
    "Your thinking is boosted by 50%.": "你的思维能力提升了 50%。",
    "Duration +5s": "持续时间 +5 秒",
    "for": "为了",
    "Increase the duration of Thought Boosts": "增加思想提升的持续时间",
    "Increase the strength of Thought Boosts": "增加思想提升的强度",
    "Scales ^1.5 with #upgrades": "缩放 ^1.5 通过#升级",
    "Thought Boost": "思想提升",
    "thoughts/s for": "想法/s",
    ", if you think it tastes better.": "，如果你觉得更好吃的话。",
    "(without scaling: +0.5s cycle duration)": "（无缩放：+0.5s 循环持续时间）",
    "/": "/",
    "+5 capacity": "+5 容量",
    "Cheepse": "奇普斯",
    "cheese": "奶酪",
    "cheese every": "奶酪，每个耗时",
    "Cheese increases thought gain": "奶酪增加思维增益",
    "Cheese Overclocking": "奶酪超频",
    "Cheese Queue": "奶酪队列",
    "Cheese Queue:": "奶酪队列：",
    "Cheese-o-mation lets you cheese clicking a button.": "Cheese-o-mation 让您只需点击一个按钮即可。",
    "Currently: 0x": "当前：0x",
    "Currently: 5": "目前：5",
    "Dark": "深色",
    "Derivative Cheese": "衍生奶酪",
    "Extended Focus": "扩展焦点",
    "Gain the ability to stack Thought Boosts.": "获得堆叠思想提升的能力。",
    "Give your employees more work like a good boss.": "像好老板一样给你的员工更多的工作。",
    "How much does a thought weigh?": "一个念头有多重？",
    "Industrious swiss workers are producing": "勤劳的瑞士工人正在生产",
    "into": "为",
    "Is it okay to eat?": "可以吃吗？",
    "Length Boost": "长度增加",
    "Lengthen the": "延长",
    "Make cheese": "制作奶酪",
    "Moldy Cheese": "发霉的奶酪",
    "Scales ^2 with #upgrades.": "使用 #升级 缩放 ^2。",
    "The capacity of the Cheese Queue boosts cheese production.": "奶酪队列的容量提高了奶酪的产量。",
    "Thinking about how to cheese faster...": "思考如何更快地奶酪......",
    "thoughts. (~": "想法。 （~",
    "thoughts/s)": "想法）",
    "Unlock an additional upgrade to make cheese production more cost-efficient.": "解锁额外升级，使奶酪生产更具成本效益。",
    "Viagra for the brain": "伟哥对大脑",
    "while consuming": "消耗",
    "You can convert": "你可以转换",
    "You can increase the speed of your workers producing cheese by forcing them to think faster.": "您可以通过强迫工人更快地思考来提高他们生产奶酪的速度。",
    "You can queue up the production of": "您可以排队生产",
    "Your workers create more cheese but also take longer": "您的工人生产更多奶酪，但也需要更长的时间",
    "Cheese Boost": "奶酪提升",
    "If you think hard enough, you can create cheese out of nothing.": "如果你足够努力，你可以从无到有创造出奶酪。",
    "Thought Boost also affects cheese production.": "思想提升也会影响奶酪的生产。",
    "(multiplicative)": "（乘法）",
    "COST": "成本",
    "Every level increases SPEED by 5%, but doubles the COST.": "每级速度增加 5%，但成本加倍。",
    "Increases the speed of a cheese cycle.": "提高奶酪循环的速度。",
    "LV": "等级",
    "Overclocking": "超频",
    "SPEED": "速度",
    "thoughts/cycle": "想法/循环",
    "\"Quality over quantity\"": "\“质量而不是数量\”",
    "(MC = moldy cheese)": "（MC=发霉的奶酪）",
    "(Moldy cheese is an unstable isotope of cheese and can decay)": "（发霉的奶酪是奶酪的不稳定同位素，会腐烂）",
    "+5% drop rate (additive)": "+5% 掉落率（附加）",
    "⮞ MC gain is boosted by": "⮞ MC（发霉的奶酪） 增益通过以下方式提升",
    "⮞ thoughts/s are boosted by": "⮞ 想法的增强是",
    "Approx. deaths:": "大约。 死亡人数：",
    "Bigger populations give a (much) bigger global boost to thinking due to emergence.": "由于出现，更多的人口给全球思维带来了更大的推动力。",
    "cheese brains": "奶酪脑",
    "Cheese Factory Protocol": "奶酪工厂协议",
    "Cheese gain is additionally boosted by MC half-life": "MC（发霉的奶酪） 半衰期还进一步提高了奶酪产量",
    "Cheese increases thoughts/s": "奶酪增加想法",
    "cheese monsters": "奶酪怪物",
    "Cheese production speeds up based on the amount of cheese cycles completed.": "奶酪生产速度根据完成的奶酪周期数量而加快。",
    "Cheese Sacrifice": "奶酪牺牲",
    "Cheesy Info": "俗气的信息",
    "Convert all cheese into": "将所有奶酪转化为",
    "Cooldown:": "冷却：",
    "Current population:": "目前人口：",
    "Death toll:": "死亡人数：",
    "destructive": "破坏性",
    "Divide the cost requirement of Overclocking": "划分超频的成本要求",
    "Effects": "效果",
    "emerges, giving an additional multiplier.": "出现，带来额外的乘数。",
    "Estimated rate:": "预计费率：",
    "Everything is working nominally.": "名义上一切正常。",
    "Expand the Cheeseyard": "扩大奶酪场",
    "Half-life:": "半衰期：",
    "Higher deaths/s are disproportionally rewarded.": "较高的死亡人数会得到不成比例的奖励。",
    "I would appreciate any feedback, suggestions, etc!": "如果有任何反馈、建议等，我将不胜感激！",
    "Improve the conversion function": "完善转换功能",
    "Improve the moldiness of monsters": "改善怪物发霉程度",
    "Improve the spawn rate in the cheeseyard": "提高奶酪场的生产率",
    "In bigger populations, a sort of global thinking": "在更多的人口中，一种全球思维",
    "In this mode you are unable to produce byprodcuts.": "在这种模式下你无法生产副产品。",
    "Increase effect of cheese boosting thought gain": "增加奶酪促进思维增益的效果",
    "Increase MC byproduct chance": "增加 MC（发霉的奶酪） 副产品机会",
    "Increase MC half-life": "增加MC（发霉的奶酪）半衰期",
    "Increase the drop rate of cheese monsters": "提高奶酪怪的掉落率",
    "Increase the loot obtained from cheese monster corpses": "增加从奶酪怪物尸体中获得的战利品",
    "Increase the maximum stack size of Thought Boosts": "增加思想提升的最大堆栈大小",
    "Inner peace lets your monsters supress their destructive urges.": "内心的平静可以让你的怪物抑制他们的破坏性冲动。",
    "Mass Murder": "大肆杀戮",
    "MAX": "最大",
    "MC byproduct gain is boosted by the rel. duration of the cheese cycle": "MC（发霉的奶酪） 副产品增益由 rel 提高。 奶酪周期的持续时间",
    "meticulous": "细致",
    "milk": "牛奶",
    "Milk would/will be a prestige layer interacting with all of the stuff so far.": "到目前为止，牛奶将成为与所有东西相互作用的声望层。",
    "moldy\n        cheese/s": "发霉\n 奶酪",
    "moldy cheese": "发霉的奶酪",
    "monster brain wave controller": "怪物脑电波控制器",
    "Monster Info": "怪物信息",
    "Monsters attack each other on sight, ripping out their brains.": "怪物一见到对方就会互相攻击，撕扯他们的大脑。",
    "neutral": "中立",
    "nominal": "名义上",
    "Nurture the sentience of monsters": "培育怪物的感知力",
    "Occasionally some monsters may start a fight to the death if they feel like it.": "有时候，一些怪物如果愿意的话，可能会发起一场殊死搏斗。",
    "peaceful": "和平",
    "Relative gain/duration/cost:": "相对增益/持续时间/成本：",
    "Relative resource generation:": "相对资源生成：",
    "Scales ^1.3 with deaths/s.": "每秒死亡人数缩放 ^1.3。",
    "Scales ^1.5 with relative duration.": "随相对持续时间缩放 ^1.5。",
    "Scales ^3 with current population.": "当前人口规模缩放 ^3。",
    "Scales ^3 with half life.": "半衰期为 ^3。",
    "Scaling: capacity^2": "缩放：容量^2",
    "Scaling: cycles^1.5": "缩放：周期^1.5",
    "Scaling: log(cycles)": "缩放：对数（周期）",
    "Spawn rate:": "生产率：",
    "Stack": "堆叠",
    "The less preoccupied the monsters are with killing each other, the more they can ponder and produce stuff.": "怪物越不专注于互相残杀，他们就越能思考和创造东西。",
    "This is the end of the demo!": "演示到此结束！",
    "Thought Jerk": "思想混蛋",
    "Total cheese cycles give a boost (multiplier) to your thinking.": "总奶酪循环可以增强（乘数）您的思维。",
    "Total Cheese Cycles:": "奶酪总循环：",
    "Total cheese monster deaths boost dropped monster loot.": "奶酪怪物死亡总数会增加怪物战利品的掉落。",
    "Total deaths:": "总死亡人数：",
    "Trains the hand speed of your workers.": "训练工人的手速。",
    "warp speed": "扭曲速",
    "When killing many cheese monsters at once, the loot is massively boosted.": "当一次杀死许多奶酪怪物时，战利品会大幅增加。",
    "whenever a cheese cycle completes": "每当奶酪循环完成时",
    "You gain": "你获得",
    "You have to perfect to art of killing to extract the most out of corpses.": "你必须精通杀戮艺术才能从尸体中榨取最多的东西。",
    "Your current cheese monsters want to help you.": "你现在的奶酪怪物想帮助你。",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "???": "???",
    // 图标代码，不能汉化
    "Jacorb's Games": "Jacorb's Games",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "By Jacorb90": "By Jacorb90",
    "content_copy": "content_copy",
    "library_books": "library_books",
    "discord": "discord",
    "drag_handle": "drag_handle",
    "edit": "edit",
    "forum": "forum",
    "content_paste": "content_paste",
    "delete": "delete",
    "info": "info",
    "settings": "settings",

    //树游戏
    'Loading...': '加载中...',
    'ALWAYS': '一直',
    'HARD RESET': '硬重置',
    'Export to clipboard': '导出到剪切板',
    'INCOMPLETE': '不完整',
    'HIDDEN': '隐藏',
    'AUTOMATION': '自动',
    'NEVER': '从不',
    'ON': '打开',
    'OFF': '关闭',
    'SHOWN': '显示',
    'Play Again': '再次游戏',
    'Keep Going': '继续',
    'The Modding Tree Discord': '模型树Discord',
    'You have': '你有',
    'It took you {{formatTime(player.timePlayed)}} to beat the game.': '花费了 {{formatTime(player.timePlayed)}} 时间去通关游戏.',
    'Congratulations! You have reached the end and beaten this game, but for now...': '恭喜你！ 您已经结束并通关了本游戏，但就目前而言...',
    'Main Prestige Tree server': '主声望树服务器',
    'Reach {{formatWhole(ENDGAME)}} to beat the game!': '达到 {{formatWhole(ENDGAME)}} 去通关游戏!',
    "Loading... (If this takes too long it means there was a serious error!": "正在加载...（如果这花费的时间太长，则表示存在严重错误！",
    'Loading... (If this takes too long it means there was a serious error!)←': '正在加载...（如果时间太长，则表示存在严重错误！）←',
    'Main\n\t\t\t\tPrestige Tree server': '主\n\t\t\t\t声望树服务器',
    'The Modding Tree\n\t\t\t\t\t\t\tDiscord': '模型树\n\t\t\t\t\t\t\tDiscord',
    'Please check the Discord to see if there are new content updates!': '请检查 Discord 以查看是否有新的内容更新！',
    'aqua': '水色',
    'AUTOMATION, INCOMPLETE': '自动化，不完整',
    'LAST, AUTO, INCOMPLETE': '最后，自动，不完整',
    'NONE': '无',
    'P: Reset for': 'P: 重置获得',
    'Git游戏': 'Git游戏',
    'QQ群号': 'QQ群号',
    'x': 'x',
    'QQ群号:': 'QQ群号:',
    '* 启用后台游戏': '* 启用后台游戏',
    '更多同类游戏:': '更多同类游戏:',
    'I': 'I',
    'II': 'I',
    'III': 'III',
    'IV': 'IV',
    'V': 'V',
    'VI': 'VI',
    'VII': 'VII',
    'VIII': 'VIII',
    'X': 'X',
    'XI': 'XI',
    'XII': 'XII',
    'XIII': 'XIII',
    'XIV': 'XIV',
    'XV': 'XV',
    'XVI': 'XVI',
    'A': 'A',
    'B': 'B',
    'C': 'C',
    'D': 'D',
    'E': 'E',
    'F': 'F',
    'G': 'G',
    'H': 'H',
    'I': 'I',
    'J': 'J',
    'K': 'K',
    'L': 'L',
    'M': 'M',
    'N': 'N',
    'O': 'O',
    'P': 'P',
    'Q': 'Q',
    'R': 'R',
    'S': 'S',
    'T': 'T',
    'U': 'U',
    'V': 'V',
    'W': 'W',
    'X': 'X',
    'Y': 'Y',
    'Z': 'Z',
    'Hz': 'Hz',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',

}


//需处理的前缀，此处可以截取语句开头部分的内容进行汉化
//例如：Coin: 13、Coin: 14、Coin: 15... 这种有相同开头的语句
//可以在这里汉化开头："Coin: ":"金币: "
var cnPrefix = {
    "\n": "\n",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": " ",
    " ": " ",
    //树游戏
    "\t\t\t": "\t\t\t",
    "\n\n\t\t": "\n\n\t\t",
    "\n\t\t": "\n\t\t",
    "\t": "\t",
    "Show Milestones: ": "显示里程碑：",
    "Autosave: ": "自动保存: ",
    "Offline Prod: ": "离线生产: ",
    "Completed Challenges: ": "完成的挑战: ",
    "High-Quality Tree: ": "高质量树贴图: ",
    "Offline Time: ": "离线时间: ",
    "Theme: ": "主题: ",
    "Anti-Epilepsy Mode: ": "抗癫痫模式：",
    "In-line Exponent: ": "直列指数：",
    "Single-Tab Mode: ": "单标签模式：",
    "Time Played: ": "已玩时长：",
    "Shift-Click to Toggle Tooltips: ": "Shift-单击以切换工具提示：",
    "Current Divisor: ": "当前除数：",
    "Scaling: log(cheese) × ": "缩放：log(奶酪) ×",
    "Currently: ": "当前: ",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀，此处可以截取语句结尾部分的内容进行汉化
//例如：13 Coin、14 Coin、15 Coin... 这种有相同结尾的语句
//可以在这里汉化结尾：" Coin":" 金币"
var cnPostfix = {
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "  ",
    " ": " ",
    "\n": "\n",
    "\n\t\t\t": "\n\t\t\t",
    "\t\t\n\t\t": "\t\t\n\t\t",
    "\t\t\t\t": "\t\t\t\t",
    "\n\t\t": "\n\t\t",
    "\t": "\t",
    " \n        cheese per cycle": " \n 奶酪 每个周期",
    " cheese brains/death": "奶酪 大脑/死亡",
    " \n        cycle duration": " \n 循环持续时间",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^(\d+)$/,
    /^\s*$/, //纯空格
    /^([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+)h ([\d\.]+)m ([\d\.]+)s$/,
    /^([\d\.]+)y ([\d\.]+)d ([\d\.]+)h$/,
    /^([\d\.]+)\-([\d\.]+)\-([\d\.]+)$/,
    /^([\d\.]+)e(\d+)$/,
    /^([\d\.]+)$/,
    /^\(([\d\.]+)\)$/,
    /^([\d\.]+)\%$/,
    /^([\d\.]+)\/([\d\.]+)$/,
    /^\(([\d\.]+)\/([\d\.]+)\)$/,
    /^主题(.+)$/,
    /^成本(.+)$/,
    /^\(([\d\.]+)\%\)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+)K$/,
    /^([\d\.]+)M$/,
    /^([\d\.]+)B$/,
    /^([\d\.]+)T$/,
    /^([\d\.]+)Sx$/,
    /^([\d\.]+) K$/,
    /^([\d\.]+) M$/,
    /^([\d\.]+) B$/,
    /^([\d\.]+)s$/,
    /^([\d\.]+)x$/,
    /^x([\d\.]+)$/,
    /^([\d\.,]+)$/,
    /^\+([\d\.,]+)$/,
    /^\-([\d\.,]+)$/,
    /^([\d\.,]+)x$/,
    /^x([\d\.,]+)$/,
    /^([\d\.,]+) \/ ([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.,]+)\/([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)\/([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e\+([\d\.,]+)$/,
    /^e([\d\.]+)e([\d\.,]+)$/,
    /^x([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)x$/,
    /^[\u4E00-\u9FA5]+$/
];
var cnExcludePostfix = [
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
//换行加空格：\n(.+)
var cnRegReplace = new Map([
    [/^([\d\.]+) hours ([\d\.]+) minutes ([\d\.]+) seconds$/, '$1 小时 $2 分钟 $3 秒'],
    [/^You are gaining (.+) elves per second$/, '你每秒获得 $1 精灵'],
    [/^You have (.+) points$/, '你有 $1 点数'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
	[/^\+(.+) brain\/death$/, '\+$1 大脑\/死亡'],
	[/^\+(.+) spawns\/s$/, '\+$1 生产\/秒'],
	[/^\+(.+) thoughts\/s$/, '\+$1 想法\/秒'],
	[/^\+(.+) MC gain\/monster$/, '\+$1 MC（发霉的奶酪） 增益\/怪物'],
	[/^\+(.+) thoughts\/s\/monster$/, '\+$1 想法\/秒\/怪物'],
	[/^\+(.+) capacity$/, '\+$1 容量'],
	[/^\+(.+) to Effect of Thought Acceleration$/, '\+$1 思维加速的效果'],
	[/^\+(.+) half\-life$/, '\+$1 半衰期'],
	[/^([\d\.]+)\/s\/monster$/, '$1\/秒\/怪物'],
	[/^([\d\.]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+)e([\d\.,]+)\/sec$/, '$1e$2\/秒'],
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^([\d\.]+)e([\d\.,]+) points$/, '$1e$2 点数'],
    [/^([\d\.]+) elves$/, '$1 精灵'],
    [/^([\d\.]+)d ([\d\.]+)h ([\d\.]+)m$/, '$1天 $2小时 $3分'],
    [/^([\d\.]+)e([\d\.,]+) elves$/, '$1e$2 精灵'],
    [/^([\d\.,]+) elves$/, '$1 精灵'],
    [/^\*(.+) to electricity gain$/, '\*$1 到电力增益'],
    [/^Cost: (.+) points$/, '成本：$1 点数'],
    [/^Req: (.+) elves$/, '要求：$1 精灵'],
    [/^Req: (.+) \/ (.+) elves$/, '要求：$1 \/ $2 精灵'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);