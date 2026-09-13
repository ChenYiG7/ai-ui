import type { Category, CategoryId } from './types';

export const categories: readonly Category[] = [
  { id: 'cards', label: '卡片', code: 'CARDS', description: '会呼吸的信息容器:光斑、倾斜与景深。' },
  {
    id: 'buttons',
    label: '按钮',
    code: 'BUTTONS',
    description: '最常被点击的地方,多一点物理感与光泽。',
  },
  { id: 'text', label: '文字动效', code: 'TEXT', description: '让标题自己开口:显现、打字与流光。' },
  {
    id: 'effects',
    label: '特效',
    code: 'EFFECTS',
    description: '跑马灯与数字节律,给页面装上脉搏。',
  },
  { id: 'backgrounds', label: '背景', code: 'BACKGROUNDS', description: '一层氛围,撑起整个首屏。' },
  { id: 'inputs', label: '输入控件', code: 'INPUTS', description: '开关与滑杆,把调节变成手感。' },
  {
    id: 'feedback',
    label: '状态反馈',
    code: 'FEEDBACK',
    description: '通知与确认,让操作得到温和回应。',
  },
  {
    id: 'agent',
    label: '智能体',
    code: 'AGENT',
    description: 'AI 界面的原生单元:流式输出、思考过程与工具调用。',
  },
  {
    id: 'navigation',
    label: '导航',
    code: 'NAVIGATION',
    description: '步骤、标签页与章节轴,让人知道自己身在何处。',
  },
  {
    id: 'scroll',
    label: '滚动',
    code: 'SCROLL',
    description: '把滚轮变成叙事:吸附画廊、堆叠卡片与环形轨道。',
  },
  {
    id: 'textures',
    label: '纹理',
    code: 'TEXTURES',
    description: '像素级的质感层:闪烁、噪点与故障。',
  },
] as const;

export function getCategory(id: CategoryId): Category {
  const found = categories.find((c) => c.id === id);
  if (!found) throw new Error(`未知分类:${id}`);
  return found;
}

/** 两位数编号,如 03 */
export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, '0');
}

export type { CategoryId } from './types';
