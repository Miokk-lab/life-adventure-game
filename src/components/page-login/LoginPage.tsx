import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button, Card, Input, Tabs, Title } from 'animal-island-ui';
import type { TabItem } from 'animal-island-ui';
import { useGameStore } from '../../stores/useGameStore';
import { useUserStore } from '../../stores/useUserStore';
import ItemIcon from '../shared/ItemIcon';
import { setPageAmbient, stopAmbient } from '../../systems/soundEngine';

export default function LoginPage() {
  const navigateTo = useGameStore((s) => s.navigateTo);
  const setUser = useUserStore((s) => s.setUser);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  useEffect(() => { setPageAmbient('login'); return () => stopAmbient(); }, []);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regName, setRegName] = useState('');
  const [regPass, setRegPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!loginEmail.trim() || !loginPass.trim()) {
      setError('请填入你的代号和密码，小岛守卫才能为你打开森林大门哦~');
      return;
    }
    const input = loginEmail.trim();
    const isEmail = input.includes('@');
    setUser({
      id: 'local',
      email: isEmail ? input : '',
      nickname: isEmail ? input.split('@')[0] : input,
      avatarUrl: '',
      islandName: '心灵岛',
    });
    navigateTo('worry');
  };

  const handleRegister = () => {
    if (!regEmail.trim() || !regName.trim() || !regPass.trim()) {
      setError('请填写完整信息，小岛需要认识你~');
      return;
    }
    setUser({ id: 'local', email: regEmail.trim(), nickname: regName.trim(), avatarUrl: '', islandName: '心灵岛' });
    navigateTo('worry');
  };

  const tabItems: TabItem[] = [
    {
      key: 'login',
      label: <span className="flex items-center gap-1">🔑 登岛</span>,
      children: (
        <div className="space-y-4 text-left">
          <div>
            <label className="text-sm font-bold mb-1 block" style={{ color: '#725d42' }}>村民代号 (邮箱/昵称)</label>
            <Input value={loginEmail} onChange={e => { setLoginEmail(e.target.value); setError(''); }}
              placeholder="邮箱地址 或 昵称" shadow size="large"
              prefix={<ItemIcon emoji="📬" size={18} />} />
          </div>
          <div>
            <label className="text-sm font-bold mb-1 block" style={{ color: '#725d42' }}>登岛暗号 (密码)</label>
            <Input value={loginPass} onChange={e => { setLoginPass(e.target.value); setError(''); }}
              placeholder="••••••••" shadow size="large" type="password"
              prefix={<ItemIcon emoji="🔒" size={18} />} />
          </div>
          {error && <p className="text-xs font-bold p-2 rounded-xl" style={{ background: '#FFEAEA', color: '#C62828' }}>{error}</p>}
          <Button type="primary" size="large" block onClick={handleLogin}>
            ✈️ 登岛！
          </Button>
        </div>
      ),
    },
    {
      key: 'register',
      label: <span className="flex items-center gap-1">🆕 创建身份</span>,
      children: (
        <div className="space-y-4 text-left">
          <div>
            <label className="text-sm font-bold mb-1 block" style={{ color: '#725d42' }}>邮箱</label>
            <Input value={regEmail} onChange={e => { setRegEmail(e.target.value); setError(''); }}
              placeholder="villager@island.life" shadow size="large"
              prefix={<ItemIcon emoji="📬" size={18} />} />
          </div>
          <div>
            <label className="text-sm font-bold mb-1 block" style={{ color: '#725d42' }}>村民代号</label>
            <Input value={regName} onChange={e => { setRegName(e.target.value); setError(''); }}
              placeholder="你的昵称" shadow size="large"
              prefix={<ItemIcon emoji="🧑‍🌾" size={18} />} />
          </div>
          <div>
            <label className="text-sm font-bold mb-1 block" style={{ color: '#725d42' }}>登岛暗号</label>
            <Input value={regPass} onChange={e => { setRegPass(e.target.value); setError(''); }}
              placeholder="••••••••" shadow size="large" type="password"
              prefix={<ItemIcon emoji="🔒" size={18} />} />
          </div>
          {error && <p className="text-xs font-bold p-2 rounded-xl" style={{ background: '#FFEAEA', color: '#C62828' }}>{error}</p>}
          <Button type="primary" size="large" block onClick={handleRegister}>
            🏝️ 注册护照，正式登岛！
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: '#F8F5EB' }}>
      {/* Background blobs — ver4 pattern */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-80 pointer-events-none" style={{ background: '#E2F1E7', filter: 'blur(120px)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-80 pointer-events-none" style={{ background: '#FFEAEA', filter: 'blur(120px)' }} />

      {/* Floating decorations */}
      <div className="absolute top-[15%] left-[10%] opacity-20 animate-bounce pointer-events-none" style={{ animationDuration: '6s' }}>
        <ItemIcon emoji="🍃" size={32} />
      </div>
      <div className="absolute top-[30%] right-[12%] opacity-20 animate-bounce pointer-events-none" style={{ animationDuration: '8s' }}>
        <ItemIcon emoji="🌸" size={28} />
      </div>
      <div className="absolute bottom-[25%] left-[15%] opacity-20 animate-bounce pointer-events-none" style={{ animationDuration: '7s' }}>
        <ItemIcon emoji="🌟" size={24} />
      </div>

      {/* Main card */}
      <motion.div className="w-full max-w-md relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="rounded-[32px] shadow-[0_12px_0_0_#C4B89E] border-4 border-[#725D42] p-6 text-center">
          {/* Roof decoration badge */}
          <div className="absolute -top-[16px] left-1/2 transform -translate-x-1/2 px-6 py-1 border-2 border-[#725D42] text-white font-bold text-xs rounded-full shadow-sm z-20"
            style={{ background: '#8CC63F' }}>
            特急！心灵无人岛移居护照办理处
          </div>

          {/* Emblem */}
          <div className="w-20 h-20 mx-auto mb-3 rounded-full border-4 border-[#725D42] bg-[#F2EDE0] flex items-center justify-center">
            <ItemIcon emoji="🍃" size={36} />
          </div>

          <Title size="large" color="app-teal">移居申请表</Title>
          <p className="text-xs mt-1 mb-6" style={{ color: '#A08E75' }}>
            欢迎来到心灵无人岛 · 你的专属疗愈空间
          </p>

          <Tabs items={tabItems} activeKey={activeTab} onChange={(k) => { setActiveTab(k as 'login' | 'register'); setError(''); }} />

          {/* Skip */}
          <button
            onClick={() => navigateTo('worry')}
            className="mt-4 text-xs font-bold underline transition-opacity hover:opacity-70"
            style={{ color: '#c4b89e' }}
          >
            跳过登录，直接开始
          </button>
        </Card>
      </motion.div>

      {/* Footer text */}
      <p className="mt-6 text-[10px] font-bold text-center relative z-10" style={{ color: '#c4b89e' }}>
        🌱 本项心智分析及疗法方案由 AI 督导设计 · 合乎 CBT 行为契约
      </p>
    </div>
  );
}
