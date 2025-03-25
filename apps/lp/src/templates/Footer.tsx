import Link from 'next/link';

import { Background } from '../background/Background';
import { CenteredFooter } from '../footer/CenteredFooter';
import { Section } from '../layout/Section';
import { Logo } from './Logo';

const Footer = () => (
  <Background color="bg-gray-200">
    <Section>
      <CenteredFooter
        logo={<Logo />}
        iconList={
          <>
            <a
              href="https://twitter.com/QuitMate_JP"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
              </svg>
            </a>
          </>
        }
      >
        <ul className="flex flex-col text-gray-800 md:flex-row">
          <li className="py-1 md:mr-4">
            <Link href="/">
              <div className="text-base md:text-lg">ホーム</div>
            </Link>
          </li>
          <li className="md:mr-4">
            <Link href="/terms">
              <div className="py-1 text-base md:text-lg">利用規約</div>
            </Link>
          </li>
          <li className="md:mr-4">
            <Link href="/privacy">
              <div className="py-1 text-base md:text-lg">
                プライバシーポリシー
              </div>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <div className="py-1 text-base md:text-lg">お問い合わせ</div>
            </Link>
          </li>
        </ul>
      </CenteredFooter>
    </Section>
  </Background>
);

export { Footer };
