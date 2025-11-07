"use client";
import { useState, useEffect, useCallback } from "react";
import { useMiniKit, useAddFrame } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import {
  Avatar,
  Name,
  Badge,
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
import { EventProvider } from "./context/EventContext";
import { EventList } from "./components/EventList";
import { CreateEventForm } from "./components/CreateEventForm";
import { useFarcasterAuth } from "./hooks/useFarcasterAuth";

type View = "events" | "create";

function HomeContent() {
  const { setFrameReady, context } = useMiniKit();
  const { address, isConnected } = useAccount();
  const addFrame = useAddFrame();
  const [view, setView] = useState<View>("events");
  const [frameAdded, setFrameAdded] = useState(false);
  const { userData, loading, error, signIn, signOut, isAuthenticated } =
    useFarcasterAuth();

  // Initialize the miniapp
  useEffect(() => {
    setFrameReady().catch((error) => {
      console.error('MiniKit initialization error:', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentUserFid = userData?.fid;
  const currentUserName = context?.user?.displayName;

  const handleCreateSuccess = () => {
    setView("events");
  };

  const handleAddFrame = useCallback(async () => {
    const result = await addFrame();
    if (result) {
      setFrameAdded(true);
    }
  }, [addFrame]);

  // Apply safe area insets
  const safeAreaStyle = {
    paddingTop: context?.client?.safeAreaInsets?.top || 0,
    paddingBottom: context?.client?.safeAreaInsets?.bottom || 0,
    paddingLeft: context?.client?.safeAreaInsets?.left || 0,
    paddingRight: context?.client?.safeAreaInsets?.right || 0,
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white p-4 md:p-8"
      style={safeAreaStyle}
    >
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-8 mb-4">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight mb-2 bg-gradient-to-br from-white to-[#e0e0e0] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Event Platform
            </h1>
            <p className="text-lg leading-relaxed text-white/70 font-light">
              {currentUserName
                ? `Welcome, ${currentUserName}!`
                : "Discover and create events on Farcaster"}
            </p>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 w-full md:w-auto">
            {!isAuthenticated ? (
              <button
                onClick={signIn}
                className="bg-[#f7d954] text-black border-2 border-[#f7d954] px-6 py-3 rounded-lg cursor-pointer text-sm font-semibold transition-all duration-300 whitespace-nowrap hover:bg-[#f5d73a] hover:border-[#f5d73a] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(247,217,84,0.3)] disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <span className="text-white/70 text-sm font-medium">
                  ✓ FID: {currentUserFid}
                </span>
                <button
                  onClick={signOut}
                  className="bg-white/10 text-white/80 border-2 border-white/20 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:bg-white/15 hover:border-white/30 w-full md:w-auto"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
        {error && (
          <div
            className="bg-[rgba(255,107,107,0.1)] border-2 border-[rgba(255,107,107,0.3)] text-[#ff6b6b] px-4 py-3 rounded-lg text-sm mt-4 text-center"
            role="alert"
          >
            {error}
          </div>
        )}
      </header>

      {/* Save Frame Button - Popular pattern in mini apps */}
      {context && !context.client.added && !frameAdded && (
        <div className="mb-6">
          <button
            onClick={handleAddFrame}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Save to Farcaster
          </button>
        </div>
      )}

      {/* Base Account (Wallet) Section */}
      <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 shadow-xl mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <span className="text-blue-400 text-lg">🔐</span>
          </div>
          <h2 className="text-lg font-semibold">Base Account</h2>
        </div>

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
      </div>

      {/* Onchain Identity - Only show when connected */}
      {isConnected && (
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 shadow-xl mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-purple-400 text-lg">✨</span>
            </div>
            <h2 className="text-lg font-semibold">Onchain Identity</h2>
          </div>

          <Identity address={address} className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-purple-500/30" />
            <div className="flex-1">
              <Name className="text-lg font-medium" />
              <Badge className="mt-1" />
            </div>
          </Identity>
        </div>
      )}

      <nav className="flex flex-col md:flex-row gap-4 justify-center mb-8 flex-wrap">
        <button
          className={`px-6 py-3 rounded-xl cursor-pointer text-base font-semibold transition-all duration-300 backdrop-blur-md ${
            view === "events"
              ? "bg-[#f7d954] text-black border-2 border-[#f7d954] hover:bg-[#f5d73a] hover:border-[#f5d73a]"
              : "bg-white/10 text-white/80 border-2 border-white/20 hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5"
          } w-full md:w-auto`}
          onClick={() => setView("events")}
          aria-label="View events"
        >
          📅 Browse Events
        </button>
        <button
          className={`px-6 py-3 rounded-xl cursor-pointer text-base font-semibold transition-all duration-300 backdrop-blur-md ${
            view === "create"
              ? "bg-[#f7d954] text-black border-2 border-[#f7d954] hover:bg-[#f5d73a] hover:border-[#f5d73a]"
              : "bg-white/10 text-white/80 border-2 border-white/20 hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5"
          } w-full md:w-auto`}
          onClick={() => setView("create")}
          aria-label="Create event"
        >
          ➕ Create Event
        </button>
      </nav>

      <main className="flex-1 w-full max-w-[1400px] mx-auto">
        {view === "events" && (
          <div className="w-full">
            <EventList currentUserFid={currentUserFid} filter="upcoming" />
          </div>
        )}

        {view === "create" && (
          <div className="w-full flex justify-center py-4">
            {loading ? (
              <div className="text-center py-12 px-4 text-white/80 text-lg">
                Authenticating...
              </div>
            ) : !isAuthenticated ? (
              <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-8 backdrop-blur-md max-w-[500px] mx-auto text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Authentication Required
                </h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Please sign in to create events using Farcaster Quick Auth.
                </p>
                <button
                  onClick={signIn}
                  className="bg-[#f7d954] text-black border-2 border-[#f7d954] px-8 py-4 rounded-xl cursor-pointer text-base font-bold transition-all duration-300 uppercase tracking-wider w-full hover:bg-[#f5d73a] hover:border-[#f5d73a] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(247,217,84,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In with Farcaster"}
                </button>
                {error && (
                  <p className="text-[#ff6b6b] mt-4 text-sm">Error: {error}</p>
                )}
              </div>
            ) : (
              <CreateEventForm
                creatorFid={currentUserFid!}
                creatorName={currentUserName}
                onSuccess={handleCreateSuccess}
                onCancel={() => setView("events")}
              />
            )}
          </div>
        )}
      </main>

      {/* Context Info - Minimalist design */}
      {context && (
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-4 border border-white/10 mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Farcaster ID</span>
            <span className="font-mono text-white/90">
              {currentUserFid || context?.user?.fid || "N/A"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <EventProvider>
      <HomeContent />
    </EventProvider>
  );
}
