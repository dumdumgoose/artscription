"use client"
import React, { ReactNode, useState } from 'react';
import { ChevronDoubleDownIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
interface PropType {
  title: string,
  children: ReactNode,
  className?: string
}
const Card = ({ title, children, className }: PropType) => {
  const [isOpen, setIsOpen] = useState(true); // State to manage collapse

  return (
    <div className={`${className} max-w-full mx-auto mb-auto bg-custom-gray p-4 rounded-lg shadow-md`}>
      <div className="flex items-center  cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <ChevronDoubleDownIcon className="w-5 h-5 mr-2" /> : <ChevronDoubleRightIcon className="w-5 h-5 mr-2" />}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {isOpen && (
        <div className='mt-4'>
          {children}
        </div>
      )}
    </div>
  );
};

export default Card;
