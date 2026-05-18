import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  TrendingUp,
  Bot,
  FolderGit2,
  Code2,
  ShieldAlert,
  Award,
  Heart,
  DollarSign,
  Wallet,
  Send,
  AlertCircle,
  Star,
  Users
} from 'lucide-react';

// Type definitions
interface FeedPost {
  id: string;
  type: 'soroban' | 'github' | 'protocol' | 'grants' | 'security';
  badge: string;
  title: string;
  desc: string;
  author: string;
  time: string;
  likes: number;
  upvotes: number;
  tips: number;
  userUpvoted?: boolean;
  userTipped?: boolean;
  aiSummaries: {
    beginner: string;
    technical: string;
    digest: string;
  };
}

interface Project {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  stars: number;
  builders: number;
  lastUpdate: string;
  repo: string;
}

interface SecurityAlert {
  id: string;
  title: string;
  desc: string;
  type: 'danger' | 'warning' | 'info';
  severity: string;
  time: string;
}

interface LeaderboardUser {
  rank: string;
  name: string;
  title: string;
  xp: number;
  activeBadge: string;
}

interface Badge {
  id: string;
  icon: string;
  name: string;
  desc: string;
  requirement: string;
  unlocked: boolean;
}

interface ChatMessage {
  sender: 'assistant' | 'user';
  text: string;
  code?: string;
}

function App() {
  // Navigation & Layout State
  const [activeTab, setActiveTab] = useState<'feed' | 'assistant' | 'devhub' | 'explainer' | 'reputation' | 'security'>('feed');
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Wallet / User Persona State
  const [currentPersona, setCurrentPersona] = useState<'developer' | 'beginner' | 'trader' | 'creator' | 'hackathon'>('developer');
  const [walletBalance, setWalletBalance] = useState(150.0);
  const [userXP, setUserXP] = useState(4500);
  const [isWalletConnected, setIsWalletConnected] = useState(true);
  
  // Tip Modal State
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState('5');
  const [customTipAmount, setCustomTipAmount] = useState('');
  const [tipSuccessConfetti, setTipSuccessConfetti] = useState(false);
  
  // AI Explainer State
  const [selectedExplainerPreset, setSelectedExplainerPreset] = useState<'token' | 'liquidity' | 'multisig'>('token');
  const [explainerInputCode, setExplainerInputCode] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainerResponse, setExplainerResponse] = useState<any>(null);

  // Security Scanner State
  const [securityScanInput, setSecurityScanInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  
  // AI Assistant Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: '🌌 Welcome to **StellarMind AI**! I am your RAG-powered developer assistant specialized in the Stellar ecosystem, Soroban smart contracts, and SDF SDK libraries. Ask me anything!'
    }
  ]);
  const [isChatTyping, setIsChatTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Developer Hub Form State
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTags, setNewProjTags] = useState('');
  const [newProjRepo, setNewProjRepo] = useState('');
  
  // Track visited tabs for the badge
  const [visitedTabs, setVisitedTabs] = useState<string[]>(['feed']);

  useEffect(() => {
    if (!visitedTabs.includes(activeTab)) {
      setVisitedTabs(prev => [...prev, activeTab]);
    }
  }, [activeTab]);

  // Handle Chat Scrolling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Mock Database
  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: 'post-1',
      type: 'soroban',
      badge: 'Soroban Release',
      title: 'Soroban v21.2.0 State Archival Optimization',
      desc: 'SDF releases an optimized archival mechanism for contract storage in Soroban, reducing storage rent fees by up to 35% and streamlining validator consensus payloads for state restoration transactions.',
      author: 'soroban-core-team',
      time: '2 hours ago',
      likes: 42,
      upvotes: 88,
      tips: 25,
      aiSummaries: {
        beginner: '💡 **Analogy:** Imagine a storage locker company. Soroban v21.2 just optimized the lockers so unused items are neatly packed away in a cheap off-site basement instead of taking up expensive prime showroom space. When you need your items back, the retrieval fee is now 35% cheaper!',
        technical: '⚙️ **Technical Details:** The release introduces an optimized `StateArchival` protocol. Contract instances that exceed their TTL (Time to Live) are moved to the `ColdStorage` bucket. Storage fee computations now incorporate a logarithmic rent formula for `Persistent` keys, reducing peak gas consumption during validator ledger synchronization.',
        digest: '📌 **Key Takeaways:**\n- Storage rent fees reduced by ~35%.\n- Improved gas model for persistent data keys.\n- Validation latency reduced on ledger state transitions.'
      }
    },
    {
      id: 'post-2',
      type: 'github',
      badge: 'GitHub Activity',
      title: 'Stellar-Core PR #4812: Ledger Hash Optimization',
      desc: 'A core protocol contributor submitted a massive performance patch optimizing the Merkle Trie ledger hashes during heavy transaction ingestion spikes, reducing processing locks from 12ms to 4ms per validation cycle.',
      author: 'orbit_dev_stellar',
      time: '5 hours ago',
      likes: 19,
      upvotes: 34,
      tips: 10,
      aiSummaries: {
        beginner: '💡 **Analogy:** Imagine a bank teller who used to take 12 seconds to double-check every single page of a giant logbook for errors. This new update gives them a smart scanning machine that cuts their verification time down to just 4 seconds!',
        technical: '⚙️ **Technical Details:** Refactors ledger hashing structures within `Stellar-Core` by utilizing parallelized SHA-256 batch calculations for ledger header envelopes. Resolves a critical thread lock condition in `LedgerManagerImpl` that caused CPU spikes during high-throughput stress tests.',
        digest: '📌 **Key Takeaways:**\n- Hashing processing latency cut from 12ms to 4ms.\n- Parallel transaction validation pipelines.\n- Core stability improved during transaction spikes.'
      }
    },
    {
      id: 'post-3',
      type: 'grants',
      badge: 'Grants & Hackathons',
      title: 'Stellar SCF Wave 19 Applications Are Open!',
      desc: 'The Stellar Community Fund (SCF) launches Wave 19 with a dedicated budget pool of 10 Million XLM for innovative Soroban-powered platforms, smart developer tools, and DeFi cross-border remittance prototypes.',
      author: 'stellar-foundation',
      time: '1 day ago',
      likes: 125,
      upvotes: 210,
      tips: 0,
      aiSummaries: {
        beginner: '💡 **Analogy:** The Stellar government is handing out seed money (10 Million XLM total) to bright builders! If you have a cool idea to build on Stellar, this is your chance to get free funding to build your dream project.',
        technical: '⚙️ **Technical Details:** The SCF Round uses a quadratic voting distribution system implemented via smart contracts. Eligible projects must demonstrate technical milestones including smart contract architectures on Soroban and fully documented SDK integrations.',
        digest: '📌 **Key Takeaways:**\n- SCF Wave 19 Pool size: 10,000,000 XLM.\n- Focus on Soroban contracts, cross-border dApps, and toolings.\n- Applications deadline is approaching!'
      }
    },
    {
      id: 'post-4',
      type: 'security',
      badge: 'Security Advisory',
      title: 'Soroban Token Auth Bypass Vulnerability Patched',
      desc: 'Security researchers discovered a potential authorization bypass in a popular community Token template where custom signature checking did not correctly match target account hashes under specific ledger sequence conditions. Check your contracts immediately!',
      author: 'stellarguard-ai',
      time: '2 days ago',
      likes: 84,
      upvotes: 145,
      tips: 45,
      aiSummaries: {
        beginner: '💡 **Analogy:** Think of an automated security door where, if you pressed two buttons at the exact microsecond the power flickered, it would let you through without checking your ID. Security guards have now fixed this glitch.',
        technical: '⚙️ **Technical Details:** The vulnerability involves incorrect state matching within the custom verification function. Under high network congestion where transaction sequence numbers drifted, the signature check succeeded by comparing against an empty signature hash envelope (`XDR::Void`). A patch enforcing hash strictness has been pushed.',
        digest: '📌 **Key Takeaways:**\n- Identified authorization bypass vulnerability in token-auth custom templates.\n- Impact: High risk if custom verification algorithms are unpatched.\n- Fix: Enforce strict hash verification and upgrade to latest compiler SDK.'
      }
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-1',
      name: 'StellarSphere',
      desc: 'An AI-powered ecosystem intelligence, developer discovery, and gamified reputation hub for Stellar and Soroban.',
      tags: ['AI Layer', 'Developer Tools', 'Soroban'],
      stars: 48,
      builders: 5,
      lastUpdate: 'Active',
      repo: 'https://github.com/stellar/stellarsphere'
    },
    {
      id: 'proj-2',
      name: 'SorobanHub',
      desc: 'A gorgeous sandbox interface allowing developers to write, deploy, and interact with smart contracts live on the Testnet from their web browser.',
      tags: ['IDE', 'Smart Contracts', 'Testnet'],
      stars: 84,
      builders: 12,
      lastUpdate: '2 days ago',
      repo: 'https://github.com/soroban-dev/sorobanhub'
    },
    {
      id: 'proj-3',
      name: 'StellarFlow',
      desc: 'Real-time transaction visualization and token tracking engine featuring custom 3D animations and ledger transaction analytics dashboards.',
      tags: ['Explorer', 'Analytics', 'USDC'],
      stars: 62,
      builders: 3,
      lastUpdate: '1 week ago',
      repo: 'https://github.com/flow-stellar/stellarflow'
    }
  ]);

  const [securityAlerts] = useState<SecurityAlert[]>([
    {
      id: 'alert-1',
      title: 'Phishing Campaign: Fake Freighter Wallet Ext',
      desc: 'AI systems flagged a malicious Chrome store extension matching the name "Freighter Wallet v2.4.1". The extension transmits user private keys to an unauthorized server. Remove immediately!',
      type: 'danger',
      severity: 'Critical',
      time: '15 mins ago'
    },
    {
      id: 'alert-2',
      title: 'Malicious Smart Contract Flagged',
      desc: 'Smart contract at `GBX3...99AL` was flagged for arbitrary balance drainage execution hooks masked as an automated market maker pool.',
      type: 'danger',
      severity: 'High',
      time: '1 hour ago'
    },
    {
      id: 'alert-3',
      title: 'Audit Approved: LiquidStellar Contract',
      desc: 'The leading protocol audit group has completed a comprehensive audit for the LiquidStellar pool contract. 0 vulnerabilities found, 1 optimization made.',
      type: 'info',
      severity: 'Low Risk',
      time: '3 hours ago'
    }
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    { id: 'badge-1', icon: '🚀', name: 'Soroban Pioneer', desc: 'Verify contract structures', requirement: 'Examine a Rust contract in the Explainer tab.', unlocked: false },
    { id: 'badge-2', icon: '💎', name: 'Ecosystem Benefactor', desc: 'Support developers with tips', requirement: 'Send a tip (XLM) to a creator in the news feed.', unlocked: false },
    { id: 'badge-3', icon: '🌌', name: 'Stellar Explorer', desc: 'Interact with all features', requirement: 'Visit all 6 main panels on the application.', unlocked: false },
    { id: 'badge-4', icon: '🛡️', name: 'Cyber Guardian', desc: 'Maintain platform safety', requirement: 'Run a security scan on a contract or url.', unlocked: false }
  ]);

  const leaderboard: LeaderboardUser[] = [
    { rank: '#1', name: 'StellarMaster', title: 'Core Protocol Architect', xp: 12400, activeBadge: '🌌' },
    { rank: '#2', name: 'SorobanRustacean', title: 'Smart Contract Auditor', xp: 9800, activeBadge: '🛡️' },
    { rank: '#3', name: 'Web3Pioneer', title: 'Tutorial Creator', xp: 7400, activeBadge: '🚀' },
    { rank: '#4', name: 'StellarSphereUser', title: 'Ecosystem Scout', xp: userXP, activeBadge: badges[1].unlocked ? '💎' : '⭐' },
    { rank: '#5', name: 'OrbitXLM', title: 'Grants Advocate', xp: 3200, activeBadge: '⚡' }
  ];

  // Code explainer templates
  const presets = {
    token: `// Soroban Token Contract Template
use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct TokenContract;

#[contractimpl]
impl TokenContract {
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        // Enforce transaction authority
        from.require_auth();
        
        let mut balance_from = env.storage().persistent().get(&from).unwrap_or(0);
        let mut balance_to = env.storage().persistent().get(&to).unwrap_or(0);
        
        assert!(balance_from >= amount, "Insufficient balance!");
        
        balance_from -= amount;
        balance_to += amount;
        
        env.storage().persistent().set(&from, &balance_from);
        env.storage().persistent().set(&to, &balance_to);
    }
}`,
    liquidity: `// Simple Liquidity Pool Deposit
use soroban_sdk::{contract, contractimpl, Env, Address};

#[contract]
pub struct LiquidityPool;

#[contractimpl]
impl LiquidityPool {
    pub fn deposit(env: Env, provider: Address, token_a: i128, token_b: i128) -> i128 {
        provider.require_auth();
        
        // Calculate shares using constant product formula
        let shares = (token_a * token_b).integer_sqrt();
        
        let current_shares = env.storage().instance().get(&provider).unwrap_or(0);
        env.storage().instance().set(&provider, &(current_shares + shares));
        
        shares
    }
}`,
    multisig: `// Multisig Signature Aggregator
use soroban_sdk::{contract, contractimpl, Env, Vec, BytesN};

#[contract]
pub struct MultiSig;

#[contractimpl]
impl MultiSig {
    pub fn verify_sigs(env: Env, threshold: u32, signatures: Vec<BytesN<64>>, tx_hash: BytesN<32>) -> bool {
        let mut valid_count = 0;
        
        for sig in signatures.iter() {
            if Self::is_valid_signature(&tx_hash, &sig) {
                valid_count += 1;
            }
        }
        
        valid_count >= threshold
    }
    
    fn is_valid_signature(hash: &BytesN<32>, sig: &BytesN<64>) -> bool {
        // Mock cryptographic verification loop
        true
    }
}`
  };

  // Populate editor with initial template
  useEffect(() => {
    setExplainerInputCode(presets[selectedExplainerPreset]);
  }, [selectedExplainerPreset]);

  // Handle Tab Visitors and unlock Badge 3 ("Stellar Explorer")
  useEffect(() => {
    if (visitedTabs.length === 6 && !badges[2].unlocked) {
      unlockBadge('badge-3');
    }
  }, [visitedTabs]);

  const unlockBadge = (id: string) => {
    setBadges(prev =>
      prev.map(b => {
        if (b.id === id && !b.unlocked) {
          setUserXP(prevXP => prevXP + 500); // 500 XP reward!
          return { ...b, unlocked: true };
        }
        return b;
      })
    );
  };

  // Upvote Post Handler
  const handleUpvote = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const wasUpvoted = post.userUpvoted;
          return {
            ...post,
            upvotes: wasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
            userUpvoted: !wasUpvoted
          };
        }
        return post;
      })
    );
    setUserXP(prev => prev + 25);
  };

  // Handle tipping process
  const triggerTip = (postId: string) => {
    setSelectedPostId(postId);
    setShowTipModal(true);
    setTipSuccessConfetti(false);
  };

  const executeTip = () => {
    const finalAmount = parseFloat(customTipAmount || tipAmount);
    if (walletBalance >= finalAmount) {
      setWalletBalance(prev => parseFloat((prev - finalAmount).toFixed(2)));
      setPosts(prev =>
        prev.map(p => {
          if (p.id === selectedPostId) {
            return {
              ...p,
              tips: p.tips + finalAmount,
              userTipped: true
            };
          }
          return p;
        })
      );
      
      unlockBadge('badge-2'); // Trigger Benefactor badge
      setTipSuccessConfetti(true);
      setUserXP(prev => prev + 150);

      setTimeout(() => {
        setShowTipModal(false);
        setTipSuccessConfetti(false);
        setCustomTipAmount('');
      }, 1500);
    } else {
      alert('Error: Insufficient simulated XLM balance.');
    }
  };

  // Handle AI Chat Submissions
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatTyping(true);

    // Simulate AI response based on query keywords
    setTimeout(() => {
      let responseText = '';
      let codeSnippet = undefined;

      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes('soroban') || lowerMsg.includes('contract')) {
        responseText = '🤖 **StellarMind AI:** Great question! Soroban is the smart contract engine on Stellar. Written in Rust, it provides excellent safety, sandboxed performance, and optimized state access models. Here is an example structure for state retrieval on Soroban:';
        codeSnippet = `use soroban_sdk::{Env, Symbol};

pub fn get_value(env: Env, key: Symbol) -> i128 {
    env.storage().instance().get(&key).unwrap_or(0)
}`;
      } else if (lowerMsg.includes('hackathon') || lowerMsg.includes('grant') || lowerMsg.includes('scf')) {
        responseText = '🤖 **StellarMind AI:** The **Stellar Community Fund (SCF)** is currently hosting Wave 19! Builders can pitch templates, toolkits, or applications. Milestone funding is disbursed instantly in XLM or USDC once approved by community validators. Check the *Developer Discovery Hub* to team up!';
      } else if (lowerMsg.includes('security') || lowerMsg.includes('scam') || lowerMsg.includes('phish')) {
        responseText = '🤖 **StellarMind AI:** Security is paramount. On Stellar, always audit custom signatures, avoid using deprecated SDK verification, and monitor account thresholds. Check the *Security Alert Panel* for real-time suspicious contracts flagged by our heuristics engine.';
      } else {
        responseText = `🤖 **StellarMind AI:** I've parsed your query in the Stellar developer database. As of ledger cycle #98124, there are 24 active proposals discussing standard token extensions. Let me know if you'd like a code boilerplate or a structural explanation!`;
      }

      setChatMessages(prev => [...prev, { sender: 'assistant', text: responseText, code: codeSnippet }]);
      setIsChatTyping(false);
      setUserXP(prev => prev + 40);
    }, 1500);
  };

  // Project submission handler
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newProjDesc) return;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: newProjName,
      desc: newProjDesc,
      tags: newProjTags ? newProjTags.split(',').map(t => t.trim()) : ['Soroban'],
      stars: 1,
      builders: 1,
      lastUpdate: 'Just now',
      repo: newProjRepo || 'https://github.com/stellar'
    };

    setProjects(prev => [...prev, newProj]);
    setNewProjName('');
    setNewProjDesc('');
    setNewProjTags('');
    setNewProjRepo('');
    setUserXP(prev => prev + 300); // 300 XP for joining the discovery hub
    alert('🌌 StellarSphere: Project successfully cataloged! It is now live in the developer discovery registry.');
  };

  // AI Technical Code Explainer Engine
  const executeCodeExplainer = () => {
    setIsExplaining(true);
    setExplainerResponse(null);

    // Simulate AI parsing
    setTimeout(() => {
      unlockBadge('badge-1'); // Unlock Pioneer badge

      if (selectedExplainerPreset === 'token') {
        setExplainerResponse({
          safetyScore: 94,
          vulnerabilities: ['Warning: No capacity cap validation detected in transfer calculations.'],
          steps: [
            { line: 'from.require_auth();', expl: '🔐 Enforces cryptographic authorization. The transaction WILL fail immediately if the client lacks the private signature keys for the `from` address.' },
            { line: 'let mut balance_from = ...', expl: '💾 Retrieves persistent account storage for the sender. Uses `unwrap_or(0)` to default empty accounts to zero.' },
            { line: 'assert!(balance_from >= amount, ...)', expl: '🛡️ Prevents double-spending. Strictly rejects transfers where the requested amount exceeds current storage balances.' },
            { line: 'env.storage().persistent().set(...)', expl: '📦 Saves updated records back into the ledger state. Triggers Soroban state rent updates.' }
          ]
        });
      } else if (selectedExplainerPreset === 'liquidity') {
        setExplainerResponse({
          safetyScore: 88,
          vulnerabilities: ['High Gas Risk: Logarithmic square root can hit validator time limits under heavy math recursion.'],
          steps: [
            { line: 'provider.require_auth();', expl: '🔐 Enforces deposit signature requirements.' },
            { line: 'let shares = (token_a * token_b).integer_sqrt();', expl: '📈 Standard constant product AMM implementation. Takes geometric mean of deposit values to calculate share allocation.' },
            { line: 'env.storage().instance().set(...)', expl: '💾 Commits provider share balances to instance storage. Instance keys automatically expire unless periodically refreshed with rent.' }
          ]
        });
      } else {
        setExplainerResponse({
          safetyScore: 98,
          vulnerabilities: [],
          steps: [
            { line: 'let mut valid_count = 0;', expl: '🧮 Allocates state counter to track validated signature counts.' },
            { line: 'Self::is_valid_signature(&tx_hash, &sig)', expl: '🔑 Performs elliptic curve signature verification loop. Employs optimized cryptographic hashes.' },
            { line: 'valid_count >= threshold', expl: '⚖️ Checks if valid signatures meet or exceed the multisig threshold.' }
          ]
        });
      }

      setIsExplaining(false);
      setUserXP(prev => prev + 150);
    }, 1800);
  };

  // Proactive Threat Scanner
  const executeSecurityScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityScanInput.trim()) return;

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      unlockBadge('badge-4'); // Unlock Security badge
      const input = securityScanInput.toLowerCase();

      if (input.includes('phish') || input.includes('wallet') || input.includes('freighter') || input.includes('claim')) {
        setScanResult({
          safe: false,
          score: 15,
          rating: 'CRITICAL THREAT',
          details: '⚠️ AI Threat Engine matches patterns of known phishing networks. Target attempts to hijack Freighter wallet seeds. Safe browsers block access.',
          auditDetails: 'Identified: Unauthorized signature bypass. Target matches phishing signature DB v941.2.'
        });
      } else if (input.includes('token') || input.includes('contract') || input.includes('0x') || input.startsWith('g')) {
        setScanResult({
          safe: true,
          score: 92,
          rating: 'VERIFIED SECURE',
          details: '✅ Soroban smart contract matched against compiled compiler schemas. No reentrancy paths, safe storage bounds verified.',
          auditDetails: 'Audited: Auth gates correct. Low gas complexity. Clean storage architecture.'
        });
      } else {
        setScanResult({
          safe: true,
          score: 85,
          rating: 'LOW RISK',
          details: '🔍 Website appears clean. Secure SSL layer verified. No malicious contract callbacks or transaction injections found.',
          auditDetails: 'Domain age: 2 years. Verified SSL. Safe hosting environment.'
        });
      }
      setIsScanning(false);
      setUserXP(prev => prev + 100);
    }, 1500);
  };

  // Filter posts by active user persona or search
  const filteredPosts = posts.filter(post => {
    // Search query filter
    if (globalSearch && !post.title.toLowerCase().includes(globalSearch.toLowerCase()) && !post.desc.toLowerCase().includes(globalSearch.toLowerCase())) {
      return false;
    }
    // Persona adaptive content filter
    if (currentPersona === 'beginner' && post.type === 'protocol') return false; // Hide deep protocol spec updates
    if (currentPersona === 'trader' && post.type === 'github') return false; // Hide raw github commits
    if (currentPersona === 'creator' && post.type === 'security') return false; // Simplify feed for content creators
    
    return true;
  });

  return (
    <div className="app-container">
      {/* 🔮 Top Header Row */}
      <header className="app-header glass-panel">
        <div className="logo-section">
          <span className="logo-icon">🌌</span>
          <h1 className="logo-text">STELLARSPHERE</h1>
        </div>

        {/* Global Semantic AI Search */}
        <div className="header-search">
          <Search size={18} />
          <input
            type="text"
            id="global-search-bar"
            placeholder="Search projects, contracts, tools, grants..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>

        <div className="header-actions">
          {/* Reputation Badge */}
          <div className="rep-counter" title="Contribution Score">
            <span>🏆</span>
            <span className="text-glow-purple">{userXP} XP</span>
          </div>

          {/* Freighter Wallet Emulator */}
          <div
            className="wallet-badge"
            id="freighter-wallet-connector"
            onClick={() => setIsWalletConnected(!isWalletConnected)}
          >
            <Wallet size={16} color={isWalletConnected ? '#06b6d4' : '#64748b'} />
            <span style={{ fontFamily: 'var(--font-tech)' }}>
              {isWalletConnected ? `Freighter: ${walletBalance} XLM` : 'Connect Wallet'}
            </span>
          </div>
        </div>
      </header>

      {/* 🚪 Main App Body */}
      <div className="app-body">
        {/* 🧭 Sidebar Panels Selector */}
        <aside className="app-sidebar glass-panel">
          <div className="nav-links">
            <div
              className={`nav-link ${activeTab === 'feed' ? 'active' : ''}`}
              id="nav-link-feed"
              onClick={() => setActiveTab('feed')}
            >
              <TrendingUp size={16} />
              <span>Ecosystem Feed</span>
            </div>

            <div
              className={`nav-link ${activeTab === 'assistant' ? 'active' : ''}`}
              id="nav-link-assistant"
              onClick={() => setActiveTab('assistant')}
            >
              <Bot size={16} />
              <span>StellarMind AI</span>
            </div>

            <div
              className={`nav-link ${activeTab === 'devhub' ? 'active' : ''}`}
              id="nav-link-devhub"
              onClick={() => setActiveTab('devhub')}
            >
              <FolderGit2 size={16} />
              <span>Discovery Hub</span>
            </div>

            <div
              className={`nav-link ${activeTab === 'explainer' ? 'active' : ''}`}
              id="nav-link-explainer"
              onClick={() => setActiveTab('explainer')}
            >
              <Code2 size={16} />
              <span>Technical Explainer</span>
            </div>

            <div
              className={`nav-link ${activeTab === 'reputation' ? 'active' : ''}`}
              id="nav-link-reputation"
              onClick={() => setActiveTab('reputation')}
            >
              <Award size={16} />
              <span>Reputation Center</span>
            </div>

            <div
              className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
              id="nav-link-security"
              onClick={() => setActiveTab('security')}
            >
              <ShieldAlert size={16} />
              <span>Security Center</span>
            </div>
          </div>

          {/* 🎭 Personalized Learning Feed Selector */}
          <div className="sidebar-footer">
            <div className="user-persona-badge">Customized Feed</div>
            <select
              id="persona-selector"
              value={currentPersona}
              onChange={(e) => {
                setCurrentPersona(e.target.value as any);
                setUserXP(prev => prev + 50);
              }}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '6px',
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="developer">🛠️ Web3 Developer</option>
              <option value="beginner">🌱 Blockchain Beginner</option>
              <option value="trader">📈 DeFi Trader</option>
              <option value="creator">✍️ Content Creator</option>
              <option value="hackathon">🏆 Hackathon Builder</option>
            </select>
          </div>
        </aside>

        {/* 💻 Main Workspace Panel viewport */}
        <main className="app-main">
          {/* ==================== tab 1: ECOSYSTEM FEED ==================== */}
          {activeTab === 'feed' && (
            <div className="fade-in">
              <header className="page-header">
                <div>
                  <h2 className="page-title">📡 ECOSYSTEM INTELLIGENCE FEED</h2>
                  <p className="page-subtitle">AI-Aggregated signals, commits, and releases across the Stellar network.</p>
                </div>
              </header>

              {/* Feed Cards */}
              <div className="feed-list">
                {filteredPosts.map(post => (
                  <div key={post.id} className="feed-card glass-card border-glow-blue">
                    <div className="feed-card-header">
                      <div className="feed-meta">
                        <span className={`feed-badge ${
                          post.type === 'soroban' ? 'badge-soroban' :
                          post.type === 'github' ? 'badge-github' :
                          post.type === 'grants' ? 'badge-grants' :
                          post.type === 'security' ? 'badge-security' : 'badge-protocol'
                        }`}>{post.badge}</span>
                        <span className="feed-time">posted by **{post.author}** • {post.time}</span>
                      </div>
                    </div>

                    <h3 className="feed-card-title">{post.title}</h3>
                    <p className="feed-card-desc">{post.desc}</p>

                    {/* AI Summaries Panel */}
                    <div className="ai-summary-container">
                      <div className="ai-summary-box">
                        <div className="ai-summary-tabs">
                          <span className="text-glow-purple" style={{ fontSize: '11px', fontWeight: '700', marginRight: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={12} color="#8b5cf6" /> StellarSphere AI Summary:
                          </span>
                          <button className="ai-summary-tab active">Beginner Analogy</button>
                        </div>
                        <div className="ai-summary-text">
                          <p style={{ marginBottom: '8px' }}>{post.aiSummaries.beginner}</p>
                          <p style={{ fontSize: '12px', color: '#c084fc', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', marginTop: '8px' }}>
                            {post.aiSummaries.technical}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="feed-actions">
                      <button
                        className={`feed-action-btn ${post.userUpvoted ? 'active-upvote' : ''}`}
                        onClick={() => handleUpvote(post.id)}
                        id={`upvote-btn-${post.id}`}
                      >
                        <Heart size={16} fill={post.userUpvoted ? '#3b82f6' : 'none'} />
                        <span>{post.upvotes} Upvotes</span>
                      </button>

                      <button
                        className={`feed-action-btn ${post.userTipped ? 'active-tip' : ''}`}
                        onClick={() => triggerTip(post.id)}
                        id={`tip-btn-${post.id}`}
                      >
                        <DollarSign size={16} />
                        <span>{post.tips > 0 ? `Tipped ${post.tips} XLM` : 'Tip Developer'}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {filteredPosts.length === 0 && (
                  <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>No active feed items matches your search or adaptive persona filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== tab 2: AI ASSISTANT ==================== */}
          {activeTab === 'assistant' && (
            <div className="fade-in">
              <header className="page-header">
                <div>
                  <h2 className="page-title text-glow-purple">🤖 STELLARMIND CO-PILOT</h2>
                  <p className="page-subtitle">Real-time RAG-powered chatbot trained on developer schemas and smart contract docs.</p>
                </div>
              </header>

              <div className="chat-container glass-card">
                <div className="chat-messages">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.sender === 'user' ? 'user' : 'assistant'}`}>
                      <div className={`chat-avatar ${msg.sender}`}>
                        {msg.sender === 'user' ? '👨‍💻' : '🌌'}
                      </div>
                      <div className="chat-bubble">
                        <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        {msg.code && (
                          <pre>
                            <code>{msg.code}</code>
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}

                  {isChatTyping && (
                    <div className="chat-message assistant">
                      <div className="chat-avatar assistant">🌌</div>
                      <div className="chat-bubble" style={{ padding: '12px 20px', color: 'var(--text-muted)' }}>
                        StellarMind AI is thinking...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleChatSubmit} className="chat-input-bar">
                  <input
                    type="text"
                    id="chat-input-field"
                    placeholder="Ask: 'What is new in Soroban?' or 'Show me a contract template'..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="chat-send-btn" id="chat-submit-btn">
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ==================== tab 3: DEV DISCOVERY HUB ==================== */}
          {activeTab === 'devhub' && (
            <div className="fade-in">
              <header className="page-header">
                <div>
                  <h2 className="page-title">💼 DEVELOPER DISCOVERY REGISTRY</h2>
                  <p className="page-subtitle">Showcase your project, coordinate developers, and earn contribution scores.</p>
                </div>
              </header>

              <div className="grid-layout">
                {projects.map(proj => (
                  <div key={proj.id} className="project-card glass-card border-glow-cyan">
                    <div>
                      <div className="project-title text-glow-cyan">{proj.name}</div>
                      <div className="project-tags">
                        {proj.tags.map((tag, i) => (
                          <span key={i} className="project-tag">{tag}</span>
                        ))}
                      </div>
                      <p className="project-desc">{proj.desc}</p>
                    </div>

                    <div className="project-stats">
                      <span className="project-stat"><Star size={13} style={{ marginRight: '2px' }} /> {proj.stars} stars</span>
                      <span className="project-stat"><Users size={13} style={{ marginRight: '2px' }} /> {proj.builders} developers</span>
                      <span className="project-stat" style={{ color: 'var(--accent-cyan)' }}>{proj.lastUpdate}</span>
                    </div>

                    <a href={proj.repo} target="_blank" rel="noopener noreferrer" className="project-btn btn-secondary">
                      View Repository
                    </a>
                  </div>
                ))}
              </div>

              {/* Submit Project form */}
              <div className="discovery-form glass-panel">
                <h3 className="form-title">➕ Catalog Your Stellar Project</h3>
                <form onSubmit={handleProjectSubmit} className="form-grid">
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      id="proj-form-name"
                      placeholder="e.g. SorobanSwap"
                      value={newProjName}
                      onChange={(e) => setNewProjName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Repository URL</label>
                    <input
                      type="url"
                      id="proj-form-repo"
                      placeholder="https://github.com/..."
                      value={newProjRepo}
                      onChange={(e) => setNewProjRepo(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tags (Comma Separated)</label>
                    <input
                      type="text"
                      id="proj-form-tags"
                      placeholder="DeFi, Wallet, Oracle"
                      value={newProjTags}
                      onChange={(e) => setNewProjTags(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Short Description</label>
                    <textarea
                      id="proj-form-desc"
                      placeholder="Describe what your project solves in the Stellar ecosystem..."
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <button type="submit" className="submit-btn" id="proj-submit-btn">Publish Showcase (+300 XP)</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ==================== tab 4: TECH EXPLAINER ==================== */}
          {activeTab === 'explainer' && (
            <div className="fade-in">
              <header className="page-header">
                <div>
                  <h2 className="page-title">🧠 AI SMART CONTRACT EXPLAINER</h2>
                  <p className="page-subtitle">Translate complex transaction envelopes and Soroban Rust contracts into visual schemas.</p>
                </div>
              </header>

              <div className="explainer-container">
                {/* Code editor */}
                <div className="explainer-editor glass-panel">
                  <div className="editor-header">
                    <span className="editor-title">Soroban smart_contract.rs</span>
                    <select
                      id="preset-code-selector"
                      className="editor-select"
                      value={selectedExplainerPreset}
                      onChange={(e) => setSelectedExplainerPreset(e.target.value as any)}
                    >
                      <option value="token">Token Contract</option>
                      <option value="liquidity">Liquidity Pool</option>
                      <option value="multisig">Multisig Wallet</option>
                    </select>
                  </div>
                  <textarea
                    className="editor-textarea"
                    id="code-explainer-textarea"
                    value={explainerInputCode}
                    onChange={(e) => setExplainerInputCode(e.target.value)}
                  />
                  <div className="editor-footer">
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: Soroban Rust Compiler v21.2</span>
                    <button
                      className="explain-btn"
                      id="explain-code-btn"
                      onClick={executeCodeExplainer}
                      disabled={isExplaining}
                    >
                      <Sparkles size={14} />
                      <span>{isExplaining ? 'Compiling & Parsing...' : 'Explain with Stellar AI'}</span>
                    </button>
                  </div>
                </div>

                {/* Explainer outputs */}
                <div className="explainer-output glass-card border-glow-purple">
                  {!explainerResponse && !isExplaining && (
                    <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-secondary)' }}>
                      <Code2 size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <h3>Select a code template and click "Explain with Stellar AI"</h3>
                      <p style={{ fontSize: '13px', marginTop: '6px' }}>Let the compiler and RAG parse functional logical gates and security safety models.</p>
                    </div>
                  )}

                  {isExplaining && (
                    <div style={{ textAlign: 'center', marginTop: '80px' }}>
                      <div className="logo-icon" style={{ fontSize: '40px', animation: 'float 2s infinite' }}>🧠</div>
                      <h3 style={{ marginTop: '16px' }}>Decompiling Soroban AST...</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>AI is parsing ledger instance storage and auth gates...</p>
                    </div>
                  )}

                  {explainerResponse && (
                    <div className="fade-in">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                        <h3 className="text-glow-purple">AI Compilation Analysis</h3>
                        <span style={{
                          padding: '4px 10px',
                          background: explainerResponse.safetyScore >= 90 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                          color: explainerResponse.safetyScore >= 90 ? 'var(--accent-green)' : 'var(--accent-gold)',
                          border: '1px solid',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          Safety: {explainerResponse.safetyScore}%
                        </span>
                      </div>

                      {/* Warnings */}
                      {explainerResponse.vulnerabilities.length > 0 && (
                        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', fontSize: '12px', color: 'var(--accent-red)', display: 'flex', gap: '8px', marginBottom: '16px' }}>
                          <AlertCircle size={16} />
                          <span>{explainerResponse.vulnerabilities[0]}</span>
                        </div>
                      )}

                      {/* Interactive Diagram representation */}
                      <div className="architecture-diagram">
                        <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Execution Sequence Diagram</span>
                        <div className="diag-node client">Freighter Client (Signature)</div>
                        <div className="diag-arrow">⬇️ require_auth()</div>
                        <div className="diag-node contract">Soroban Contract Context</div>
                        <div className="diag-arrow">⬇️ instance().set()</div>
                        <div className="diag-node ledger">Stellar Ledger State</div>
                      </div>

                      {/* Step by Step Breakdown */}
                      <div style={{ marginTop: '20px' }}>
                        <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px' }}>Logical Breakdown:</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {explainerResponse.steps.map((st: any, i: number) => (
                            <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                              <code style={{ fontSize: '12px', color: '#a7f3d0', fontFamily: 'var(--font-mono)' }}>{st.line}</code>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>{st.expl}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== tab 5: REPUTATION CENTER ==================== */}
          {activeTab === 'reputation' && (
            <div className="fade-in">
              <header className="page-header">
                <div>
                  <h2 className="page-title">🏆 ECOSYSTEM CONTRIBUTOR REPUTATION</h2>
                  <p className="page-subtitle">Earn levels, complete developer quests, and mint verified on-chain badges.</p>
                </div>
              </header>

              <div className="rep-grid">
                <div className="rep-sidebar-panel">
                  {/* XP Score */}
                  <div className="reputation-score-card glass-panel border-glow-purple">
                    <div className="xp-circle">
                      <span className="xp-value">{userXP}</span>
                      <span className="xp-label">Total XP</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '18px', fontWeight: '700' }}>Web3 Explorer</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Stellar Dev Rank: #4</p>
                  </div>

                  {/* Badges rack */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '16px' }}>Earned Attestation Badges</h3>
                    <div className="badge-rack">
                      {badges.map(b => (
                        <div key={b.id} className={`badge-item glass-card ${b.unlocked ? 'border-glow-cyan' : 'locked'}`} id={`badge-item-${b.id}`}>
                          <span className="badge-icon">{b.icon}</span>
                          <span className="badge-name">{b.name}</span>
                          <div style={{
                            position: 'absolute',
                            bottom: '-4px',
                            background: b.unlocked ? 'var(--accent-green)' : 'var(--text-muted)',
                            padding: '1px 6px',
                            borderRadius: '99px',
                            fontSize: '8px',
                            fontWeight: '800'
                          }}>{b.unlocked ? 'MINTED' : 'LOCKED'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="leaderboard-panel glass-panel border-glow-blue">
                  <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-tech)', fontWeight: '700' }}>🏆 Global Contributor Leaderboard</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Scores refresh every 24 hours based on Git commits & tutorials.</p>

                  <div className="leaderboard-list">
                    {leaderboard.map((user, i) => (
                      <div key={i} className="leaderboard-item">
                        <span className={`leaderboard-rank ${i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : ''}`}>
                          {user.rank}
                        </span>
                        <span className="leaderboard-name">{user.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '16px' }}>{user.title}</span>
                        <span className="leaderboard-xp">{user.xp} XP</span>
                      </div>
                    ))}
                  </div>

                  {/* Git representation graph */}
                  <div className="contrib-graph glass-card" style={{ marginTop: '24px' }}>
                    <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Ecosystem Engagement Frequency</h4>
                    <div className="graph-tiles">
                      {[...Array(64)].map((_, i) => {
                        const level = i % 5 === 0 ? 'high' : i % 3 === 0 ? 'mid' : i % 7 === 0 ? 'max' : i % 11 === 0 ? 'low' : '';
                        return <div key={i} className={`tile ${level}`} />;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== tab 6: SECURITY CENTER ==================== */}
          {activeTab === 'security' && (
            <div className="fade-in">
              <header className="page-header">
                <div>
                  <h2 className="page-title text-glow-cyan">🛡️ STELLARGUARD SECURITY ENGINE</h2>
                  <p className="page-subtitle">Real-time scan alerts, verified contract audits, and custom URL threat analysis.</p>
                </div>
              </header>

              <div className="security-grid">
                <div className="threat-detector glass-panel border-glow-cyan">
                  <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-tech)', fontWeight: '700' }}>Scan URL or Soroban Contract</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Validate address integrity or identify phishing nodes instantly.</p>

                  <form onSubmit={executeSecurityScan} className="detector-input-group">
                    <input
                      type="text"
                      id="security-url-input"
                      placeholder="Enter contract hash (e.g. GBX3...) or ecosystem URL..."
                      value={securityScanInput}
                      onChange={(e) => setSecurityScanInput(e.target.value)}
                      required
                    />
                    <button type="submit" className="detector-btn" id="security-scan-btn">
                      {isScanning ? 'Scanning...' : 'Scan Node'}
                    </button>
                  </form>

                  {/* Radar sweep effect */}
                  <div className="radar-display">
                    <div className="radar-sweep" />
                    <div className="radar-blip" style={{ top: '30%', left: '45%' }} />
                    <div className="radar-blip" style={{ top: '65%', left: '20%' }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent-cyan)'
                    }}>SCANNING NETWORK TELEMETRY...</div>
                  </div>

                  {/* Scan Result */}
                  {scanResult && (
                    <div className="fade-in" style={{
                      padding: '16px',
                      borderRadius: '10px',
                      background: scanResult.safe ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                      border: `1px solid ${scanResult.safe ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{
                          color: scanResult.safe ? 'var(--accent-green)' : 'var(--accent-red)',
                          fontFamily: 'var(--font-tech)'
                        }}>{scanResult.rating}</h4>
                        <span style={{ fontSize: '12px', fontWeight: '700' }}>Index Score: {scanResult.score}/100</span>
                      </div>
                      <p style={{ fontSize: '13px', marginTop: '6px', lineHeight: '1.4' }}>{scanResult.details}</p>
                      <code style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
                        {scanResult.auditDetails}
                      </code>
                    </div>
                  )}
                </div>

                <div className="alerts-panel glass-panel border-glow-purple">
                  <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-tech)', fontWeight: '700', color: 'var(--accent-red)' }}>🚨 Active Ecosystem Alerts</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Scam signals aggregated via validator feeds.</p>

                  <div className="alert-feed-list">
                    {securityAlerts.map(alert => (
                      <div key={alert.id} className={`alert-item ${alert.type === 'danger' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'}`}>
                        <span className="alert-icon">⚠️</span>
                        <div className="alert-content">
                          <h4>{alert.title}</h4>
                          <p>{alert.desc}</p>
                          <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', opacity: 0.6 }}>Severity: {alert.severity} • {alert.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================== TIPPING MODAL (Freighter Wallet Emulator) ==================== */}
      {showTipModal && (
        <div className="modal-overlay">
          <div className="tip-modal glass-panel border-glow-cyan fade-in">
            <div className="modal-header">
              <h3 className="modal-title">Authorize Ecosystem Tip</h3>
              <button className="modal-close" onClick={() => setShowTipModal(false)}>×</button>
            </div>

            {tipSuccessConfetti ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <span style={{ fontSize: '48px', display: 'block', animation: 'float 1s infinite' }}>🎉</span>
                <h3 style={{ color: 'var(--accent-cyan)', marginTop: '12px' }}>Transaction Settled!</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Simulated smart contract ledger executed.</p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Support the developer by sending a micro-transaction directly through the Freighter Wallet sandbox.
                </p>

                {/* Preset options */}
                <div className="tip-options">
                  {['5', '10', '25', '50'].map(val => (
                    <button
                      key={val}
                      className={`tip-option-btn ${tipAmount === val && !customTipAmount ? 'active' : ''}`}
                      onClick={() => {
                        setTipAmount(val);
                        setCustomTipAmount('');
                      }}
                    >
                      {val} XLM
                    </button>
                  ))}
                </div>

                <div className="custom-tip-input">
                  <label>Custom Amount (XLM)</label>
                  <input
                    type="number"
                    id="tip-modal-amount"
                    placeholder="Enter custom tip quantity"
                    value={customTipAmount}
                    onChange={(e) => setCustomTipAmount(e.target.value)}
                  />
                </div>

                <div className="wallet-balance-row">
                  <span>Freighter Wallet:</span>
                  <span>{walletBalance} XLM</span>
                </div>

                <button
                  className="project-btn btn-primary"
                  id="tip-modal-submit-btn"
                  onClick={executeTip}
                  style={{ width: '100%' }}
                >
                  Confirm & Mint Tip (+150 XP)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
