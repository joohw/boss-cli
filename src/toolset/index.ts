/** 业务实现聚合出口：impl* 供 CLI 与其它模块调用 */
import { runLogin } from './login.js';
import { runGetCandidateList } from './list.js';
import { runListOpenPositions } from './jd.js';
import { runOpenCandidateChat } from './chat.js';
import {
  runChatActionOnCurrentConversation,
  type ChatPageAction,
} from './action.js';
import { runSendChatMessage } from './send.js';
import { withBossSessionPage } from '../browser/index.js';
import { runBossSearch, runBossSearchSet } from './deep-search.js';
import { runRecommend, runRecommendPreview } from './recommend.js';
import { runRecommendGreet } from './greet.js';
export type { ChatPageAction };
export type { DeepSearchGeekItem } from './deep-search.js';

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
): Promise<string> {
  return withBossSessionPage(async (page) => runOpenCandidateChat(page, candidateName, exact));
}

export async function implChatAction(params: {
  action: ChatPageAction;
  remark?: string;
}): Promise<string> {
  return withBossSessionPage(async (page) => runChatActionOnCurrentConversation(page, params));
}

export async function implSendMessage(params: {
  text: string;
}): Promise<string> {
  return runSendChatMessage({
    text: params.text || undefined,
  });
}

export async function implListPositions(): Promise<string> {
  return runListOpenPositions();
}

export async function implListPositionsWithOptions(opts: {
  detail?: boolean;
  name?: string;
}): Promise<string> {
  return runListOpenPositions({
    detail: opts.detail,
    detailName: opts.name,
  });
}

export async function implBossSearch(opts: { jobKeyword?: string } = {}): Promise<string> {
  return runBossSearch(opts);
}

export async function implBossSearchSet(opts: {
  jobKeyword?: string;
  coreRequirements?: string[];
  bonusRequirements?: string[];
}): Promise<string> {
  return runBossSearchSet(opts);
}

export async function implRecommend(jobKeyword?: string): Promise<string> {
  return runRecommend(jobKeyword);
}

export async function implRecommendPreview(opts: {
  candidateTarget: string;
  jobKeyword?: string;
}): Promise<string> {
  return runRecommendPreview(opts);
}

export async function implRecommendGreet(target: string): Promise<string> {
  return runRecommendGreet(target);
}
