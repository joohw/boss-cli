/** 业务实现聚合出口：impl* 供 CLI 与其它模块调用 */
import { runLogin } from './login.js';
import { runGetCandidateList } from './get_candidate_list.js';
import { runListOpenPositions } from './list_open_positions.js';
import { runOpenCandidateChat } from './open_candidate_chat.js';
import { runOpenChatList } from './open_chat_list.js';
import { runSendChatMessage } from './send_chat_message.js';

export async function implOpenChatList(): Promise<string> {
  return runOpenChatList();
}

export async function implLogin(): Promise<string> {
  return runLogin();
}

export async function implGetCandidateList(note?: string): Promise<string> {
  return runGetCandidateList(note);
}

export async function implOpenCandidateChat(
  candidateName: string,
  exact: boolean,
): Promise<string> {
  return runOpenCandidateChat(candidateName, exact);
}

export async function implSendChatMessage(
  text: string,
  alsoRequestResume: boolean,
): Promise<string> {
  return runSendChatMessage(text, alsoRequestResume);
}

export async function implListOpenPositions(note?: string): Promise<string> {
  return runListOpenPositions(note);
}
