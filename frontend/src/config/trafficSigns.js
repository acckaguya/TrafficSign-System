// 交通标志配置表

export const TRAFFIC_SIGN_CONFIG = {
  // 限速系列 (红色圆形)
  "class_0": { label: "限速 5", icon: "5", type: "limit", limit: 5, advice: "前方限速5公里，请保持极慢速" },
  "class_1": { label: "限速 15", icon: "15", type: "limit", limit: 15, advice: "前方限速15公里，注意慢行" },
  "class_2": { label: "限速 30", icon: "30", type: "limit", limit: 30, advice: "进入限速30区域，请控制车速" },
  "class_3": { label: "限速 40", icon: "40", type: "limit", limit: 40, advice: "限速40公里，请勿超速" },
  "class_4": { label: "限速 50", icon: "50", type: "limit", limit: 50, advice: "城市道路限速50，平稳驾驶" },
  "class_5": { label: "限速 60", icon: "60", type: "limit", limit: 60, advice: "限速60公里，注意保持车距" },
  "class_6": { label: "限速 70", icon: "70", type: "limit", limit: 70, advice: "限速70公里，请勿超速" },
  "class_7": { label: "限速 80", icon: "80", type: "limit", limit: 80, advice: "快速路限速80，注意安全" },

  // 禁令系列 (红色圆圈/禁止)
  "class_8": { label: "禁直行左转", icon: "↛", type: "forbid", advice: "路口禁止直行和左转" },
  "class_9": { label: "禁直行右转", icon: "↛", type: "forbid", advice: "路口禁止直行和右转" },
  "class_10": { label: "禁止直行", icon: "↑", type: "forbid", advice: "前方禁止直行，请绕行" },
  "class_11": { label: "禁止左转", icon: "↰", type: "forbid", advice: "路口禁止向左转弯" },
  "class_12": { label: "禁左右转", icon: "↔", type: "forbid", advice: "禁止向左和向右转弯" },
  "class_13": { label: "禁止右转", icon: "↱", type: "forbid", advice: "路口禁止向右转弯" },
  "class_14": { label: "禁止超车", icon: "🚗", type: "forbid", advice: "该路段禁止超车" },
  "class_15": { label: "禁止掉头", icon: "↶", type: "forbid", advice: "前方禁止掉头" },
  "class_16": { label: "禁止驶入", icon: "🚫", type: "forbid", advice: "机动车禁止驶入" },
  "class_17": { label: "禁止鸣喇叭", icon: "🔇", type: "forbid", advice: "静音区域，禁止鸣笛" },
  
  // 解除限制
  "class_18": { label: "解除限速", icon: "○", type: "info", advice: "限制速度路段结束" },
  "class_19": { label: "解除限速", icon: "○", type: "info", advice: "限制速度路段结束" },

  // 指示系列 (蓝色圆形)
  "class_20": { label: "直行右转", icon: "↱", type: "guide", advice: "只准直行和向右转弯" },
  "class_21": { label: "只准直行", icon: "↑", type: "guide", advice: "前方只准直行" },
  "class_22": { label: "只准左转", icon: "↰", type: "guide", advice: "前方只准向左转弯" },
  "class_23": { label: "左转右转", icon: "↔", type: "guide", advice: "只准向左和向右转弯" },
  "class_24": { label: "只准右转", icon: "↱", type: "guide", advice: "前方只准向右转弯" },
  "class_25": { label: "靠左行驶", icon: "↖", type: "guide", advice: "请靠道路左侧行驶" },
  "class_26": { label: "靠右行驶", icon: "↗", type: "guide", advice: "请靠道路右侧行驶" },
  "class_27": { label: "环岛行驶", icon: "↺", type: "guide", advice: "进入环岛，请逆时针行驶" },
  "class_28": { label: "机动车道", icon: "🚘", type: "guide", advice: "机动车行驶车道" },
  "class_29": { label: "鸣喇叭", icon: "🔊", type: "guide", advice: "视线不良，请鸣喇叭示警" },
  "class_30": { label: "非机动车", icon: "🚲", type: "guide", advice: "非机动车行驶车道" },
  "class_31": { label: "允许掉头", icon: "↶", type: "guide", advice: "前方路口允许掉头" },

  // 警告系列 (黄色三角形)
  "class_32": { label: "左右绕行", icon: "↔", type: "warn", advice: "前方有障碍物，请减速绕行" },
  "class_33": { label: "信号灯", icon: "🚦", type: "warn", advice: "前方有交通信号灯，注意观察" },
  "class_34": { label: "注意危险", icon: "!", type: "warn", advice: "前方危险，请谨慎驾驶" },
  "class_35": { label: "注意行人", icon: "🚶", type: "warn", advice: "减速慢行，礼让行人" },
  "class_36": { label: "注意非机动车", icon: "🚲", type: "warn", advice: "注意避让非机动车" },
  "class_37": { label: "注意儿童", icon: "🚸", type: "warn", advice: "学校区域，注意儿童" },
  "class_38": { label: "右急转弯", icon: "⤵", type: "warn", advice: "前方右急转弯，请减速" },
  "class_39": { label: "左急转弯", icon: "⤵", type: "warn", advice: "前方左急转弯，请减速" },
  "class_40": { label: "下坡路", icon: "📉", type: "warn", advice: "前方下坡，请控制车速" },
  "class_41": { label: "上坡路", icon: "📈", type: "warn", advice: "前方上坡，注意档位" },
  "class_42": { label: "慢行", icon: "Slow", type: "warn", advice: "前方路况复杂，请慢行" },
  "class_43": { label: "右丁字路", icon: "T", type: "warn", advice: "前方右侧有路口汇入" },
  "class_44": { label: "左丁字路", icon: "T", type: "warn", advice: "前方左侧有路口汇入" },
  "class_45": { label: "村庄", icon: "🏠", type: "warn", advice: "通过村庄，注意观察" },
  "class_46": { label: "反向弯路", icon: "⌇", type: "warn", advice: "前方连续反向弯路" },
  "class_47": { label: "无人铁路", icon: "🚂", type: "warn", advice: "无人看守铁路道口" },
  "class_48": { label: "施工", icon: "🚧", type: "warn", advice: "前方施工，注意避让" },
  "class_49": { label: "连续弯路", icon: "⌇", type: "warn", advice: "连续弯路，减速慢行" },
  "class_50": { label: "有人铁路", icon: "🚂", type: "warn", advice: "有人看守铁路道口" },
  "class_51": { label: "事故易发", icon: "⚠", type: "warn", advice: "事故易发路段，谨慎驾驶" },

  // 禁令与让行 (特殊形状)
  "class_52": { label: "停车让行", icon: "停", type: "stop", advice: "必须停车观察，确认安全后通过" },
  "class_53": { label: "禁止通行", icon: "🚫", type: "forbid", advice: "前方禁止通行" },
  "class_54": { label: "禁止停放", icon: "╳", type: "forbid", advice: "禁止临时或长时停车" },
  "class_55": { label: "禁止驶入", icon: "⛔", type: "forbid", advice: "禁止车辆驶入" },
  "class_56": { label: "减速让行", icon: "让", type: "warn", advice: "减速慢行，优先主路车辆" },
  "class_57": { label: "停车检查", icon: "检", type: "stop", advice: "停车接受检查" },

  "default": { label: "未知标志", icon: "?", type: "info", advice: "注意观察路况" }
};

export const getSignConfig = (classId) => {
  return TRAFFIC_SIGN_CONFIG[classId] || TRAFFIC_SIGN_CONFIG["default"];
};