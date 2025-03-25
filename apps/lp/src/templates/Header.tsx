import Link from 'next/link';
import { useState } from 'react';

import { Background } from '@/background/Background';
import { Section } from '@/layout/Section';

import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { Logo } from './Logo';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Background color="bg-gray-100">
      <Section yPadding="pt-4 pb-4">
        <NavbarTwoColumns logo={<Logo xl />}>
          <li className="hidden md:block">
            <Link href="/terms">
              <div className="text-lg">利用規約</div>
            </Link>
          </li>
          <li className="hidden md:block">
            <Link href="/privacy">
              <div className="text-lg">プライバシーポリシー</div>
            </Link>
          </li>
          <li className="hidden md:block">
            <Link href="/contact">
              <div className="text-lg">お問い合わせ</div>
            </Link>
          </li>
          <div className="md:hidden">
            <button
              aria-label="メニューボタン"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="size-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </NavbarTwoColumns>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
              className="absolute inset-0 z-40 bg-black opacity-50"
              onClick={() => setIsOpen(false)}
            ></div>

            {/* Modal */}
            <div className="relative z-50 w-11/12 rounded-lg bg-white p-8 text-gray-700 shadow-xl md:w-1/2">
              <button
                className="absolute right-4 top-4 rounded-full bg-gray-500 p-1 text-white shadow-md transition-shadow duration-300 hover:bg-gray-600 hover:shadow-lg"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
              <ul>
                <li className="my-4 text-center">
                  <Link href="/terms">
                    <p
                      className="text-xl font-bold hover:underline"
                      onClick={() => setIsOpen(false)}
                    >
                      利用規約
                    </p>
                  </Link>
                </li>
                <li className="my-4 text-center">
                  <Link href="/privacy">
                    <p
                      className="text-xl font-bold hover:underline"
                      onClick={() => setIsOpen(false)}
                    >
                      プライバシーポリシー
                    </p>
                  </Link>
                </li>
                <li className="my-4 text-center">
                  <Link href="/contact">
                    <p
                      className="text-xl font-bold hover:underline"
                      onClick={() => setIsOpen(false)}
                    >
                      お問い合わせ
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </Section>
    </Background>
  );
};

export { Header };
