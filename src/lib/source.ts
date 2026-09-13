import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const componentsDir = path.join(process.cwd(), 'src', 'registry', 'components');

/** 读取组件源码,并把站内别名改写为读者项目中的约定路径 */
export async function readComponentSource(file: string): Promise<string> {
  const raw = await readFile(path.join(componentsDir, file), 'utf8');
  return raw.replace(/@\/registry\/components\/[\w/-]+\//g, '@/components/ui/');
}
