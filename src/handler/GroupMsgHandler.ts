import { AllHandlers, Structs } from "node-napcat-ts";
import { randomPickFromSpaceStr } from "../utils/StringUtils.js";
import { napcat } from "../napcat/napcat.js";
import { callArkChatApi } from "../utils/callOpenAI.js";
type CommandHandler = (context: AllHandlers["message.group"]) => Promise<void>;
const COMMANDS: Record<string, CommandHandler> = {
    test: testCommandHandler,
    roll: rollCommandHandler,
};

/**
 * 群消息核心处理器：通用命令匹配逻辑
 * @param context 群消息上下文
 */
async function groupMsgHandler(context: AllHandlers["message.group"]): Promise<void> {
    try {
        if (context.raw_message === '测试') {
            await COMMANDS['test'](context);
            return;
        }
        if (context.raw_message.startsWith('roll')) {
            await COMMANDS['roll'](context);
            return;
        }
        if (isAtSelf(context)) {
            const pureText = getPureText(context.message);
            const AIResp = await callArkChatApi(pureText);
            await context.quick_action([Structs.text(AIResp)]);
            return;
        }
    } catch (error) {
        await context.quick_action([Structs.text(`${error}`)]);
    }
}
/** * 判断消息中是否包含at机器人的内容
 * @param {Object} msg - 消息对象，包含消息内容和发送者信息
 * @returns {boolean} 如果消息中包含at机器人则返回true，否则返回false
 */
function isAtSelf(msg: AllHandlers["message.group"]): boolean {
    return msg.message.some((element) => {
        return element.type === 'at' && element.data.qq === msg.self_id + '';
    });
}
/**
 * 移除消息数组中的at类型项，提取纯文本内容
 * @param {Array} message - 原始消息数组（包含at/text/image等类型）
 * @returns {string} 去除at后的纯文本
 */
function getPureText(message: AllHandlers['message.group']['message']): string {
    // 步骤1：过滤掉所有type为at的项，只保留text类型的项
    const textItems = message.filter(item => item.type === "text");

    // 步骤2：提取每个text项的文本内容
    const textContents = textItems.map(item => item.data.text);

    // 步骤3：拼接所有文本（按原顺序），返回最终纯文本
    return textContents.join("");
}
/**
 * 
 * @param msg 
 */
async function testCommandHandler(msg: AllHandlers["message.group"]) {
    await msg.quick_action([Structs.text('测试成功喵~')]);
}
/**
 * 
 * @param msg 
 */
async function rollCommandHandler(msg: AllHandlers["message.group"]) {
    const resp = randomPickFromSpaceStr(msg.raw_message)
    await napcat.send_group_msg({
        group_id: msg.group_id,
        message: [Structs.text(`${resp}`)]
    })
}
export default groupMsgHandler;