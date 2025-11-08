"use client";

import {
  Avatar,
  Name,
  Address,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";

export function WalletSection() {
  return (
    <Wallet>
      <ConnectWallet className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl py-3 transition-all duration-200">
        <Avatar className="h-6 w-6" />
        <Name className="ml-2" />
      </ConnectWallet>
      <WalletDropdown className="rounded-2xl border border-white/20 bg-gray-900">
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
          <Avatar className="h-10 w-10" />
          <Name className="font-medium" />
          <Address />
          <EthBalance />
        </Identity>
        <WalletDropdownDisconnect className="hover:bg-gray-800" />
      </WalletDropdown>
    </Wallet>
  );
}
