import { resolve } from 'path';
import { readFileSync } from 'fs';

import expect from 'expect.js';

import { generateNoticeText } from '../notice';

const NODE_MODULES = resolve(__dirname, '../../../../node_modules');
const NODE_DIR = resolve(process.execPath, '../..');
const PACKAGES = [
  {
    name: '@elastic/filesaver',
    version: '1.1.2',
    licenses: ['MIT'],
    directory: resolve(NODE_MODULES, '@elastic/filesaver'),
    relative: 'node_modules/@elastic/filesaver',
  },
  {
    name: 'aws-sdk',
    version: '2.0.31',
    licenses: ['Apache 2.0'],
    directory: resolve(NODE_MODULES, 'aws-sdk'),
    relative: 'node_modules/aws-sdk',
  }
];

describe('tasks/lib/notice', () => {
  describe('generateNoticeText()', () => {
    let notice;
    before(async () => notice = await generateNoticeText({
      packages: PACKAGES,
      nodeDir: NODE_DIR
    }));

    it('returns a string', () => {
      expect(notice).to.be.a('string');
    });

    it('includes *NOTICE* files from packages', () => {
      expect(notice).to.contain(readFileSync(resolve(NODE_MODULES, 'aws-sdk/NOTICE.txt'), 'utf8'));
    });

    it('includes *LICENSE* files from packages', () => {
      expect(notice).to.contain(readFileSync(resolve(NODE_MODULES, '@elastic/filesaver/LICENSE.md'), 'utf8'));
    });

    it('includes the LICENSE file from node', () => {
      expect(notice).to.contain(readFileSync(resolve(NODE_DIR, 'LICENSE'), 'utf8'));
    });

    it('includes the NOTICE.txt file', () => {
      expect(notice).to.contain(readFileSync(resolve(__dirname, '../../../../NOTICE.txt'), 'utf8'));
    });
  });
});
