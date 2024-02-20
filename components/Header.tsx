"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-col gap-5 items-center">
      <h1 className="sr-only">supasplit</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">The easiest way to keep track of your shared expenses with anyone.</p>
      <p className="bg-purple-300 px-5 py-2 rounded-3xl mb-10 text-lg">
        <Link href="/login">100% free to use. Sign Up here to start!</Link>
      </p>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, ease: "linear", repeat: Infinity }}>
        <Image src="/favicon-3.png" height={150} width={150} alt="supasplit" />
      </motion.div>
    </div>
  );
}
