/** 业务实现聚合出口：impl* 供 CLI 与其它模块调用 */
import { runLogin } from './login.js';
import { runGetCandidateList } from './list_candidates.js';
import { runListOpenPositions } from './list_positions.js';
import { runOpenCandidateChat } from './open_chat.js';
import { runSendChatMessage } from './send_message.js';
import { withChatPage } from '../browser/index.js';

export async function implLogin(): Promise<string> {
  return runLogin();
}

export async function implListCandidates(): Promise<string> {
  return runGetCandidateList();
}

export async function implListUnreadCandidates(): Promise<string> {
  return runGetCandidateList({ unreadOnly: true });
}

export async function implOpenChat(candidateName: string, exact: boolean): Promise<string> {
  return withChatPage(async (page) => runOpenCandidateChat(page, candidateName, exact));
}

export async function implSendMessage(
  text: string,
  alsoRequestResume: boolean,
): Promise<string> {
  return runSendChatMessage(text, alsoRequestResume);
}

export async function implListPositions(): Promise<string> {
  return runListOpenPositions();
}
