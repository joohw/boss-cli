/** 业务实现聚合出口：impl* 供 CLI 与其它模块调用 */
import { runLogin } from './login.js';
import { runGetCandidateList } from './list_candidates.js';
import { runListOpenPositions } from './list_positions.js';
import { runOpenCandidateChat, type ChatOpenAction } from './open_chat.js';
import { runSendChatMessage, type SendAction } from './send_message.js';
import { implSkillCli } from './skill.js';
import { withChatPage } from '../browser/index.js';

export type { SendAction } from './send_message.js';
export type { ChatOpenAction };

export async function implLogin(): Promise<string> {
  return runLogin();
}

export async function implListCandidates(): Promise<string> {
  return runGetCandidateList();
}

export async function implListUnreadCandidates(): Promise<string> {
  return runGetCandidateList({ unreadOnly: true });
}

export async function implOpenChat(
  candidateName: string,
  exact: boolean,
  options?: { action?: ChatOpenAction },
): Promise<string> {
  return withChatPage(async (page) => runOpenCandidateChat(page, candidateName, exact, options));
}

export async function implSendMessage(params: {
  text: string;
  action?: SendAction;
}): Promise<string> {
  return runSendChatMessage({
    text: params.text || undefined,
    action: params.action,
  });
}

export async function implListPositions(): Promise<string> {
  return runListOpenPositions();
}

export async function implSkill(tail: string[]): Promise<string> {
  return implSkillCli(tail);
}
