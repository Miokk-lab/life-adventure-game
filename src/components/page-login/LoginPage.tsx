import { useGameStore } from '../../stores/useGameStore';
import { Button, Card, Input, Title, Icon } from 'animal-island-ui';

export default function LoginPage() {
  const navigateTo = useGameStore((s) => s.navigateTo);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#F8F5EB' }}>
      <div className="max-w-md w-full">
        <Card color="app-teal" className="text-center">
          <div className="mb-4">
            <Icon name="icon-helicopter" size={48} bounce />
          </div>
          <Title size="large" color="app-blue">移居申请表</Title>
          <p className="text-sm mt-2 mb-6" style={{ color: '#9f927d' }}>
            欢迎来到心灵无人岛！请填写你的村民信息。
          </p>
          <div className="flex flex-col gap-4 text-left">
            <div>
              <label className="text-sm font-bold mb-1 block" style={{ color: '#725d42' }}>村民代号</label>
              <Input placeholder="输入你的昵称…" shadow size="large" />
            </div>
            <div>
              <label className="text-sm font-bold mb-1 block" style={{ color: '#725d42' }}>登岛暗号</label>
              <Input placeholder="输入密码…" shadow size="large" type="password" />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button type="primary" size="large" block onClick={() => navigateTo('worry')}>
              ✈️ 登岛！
            </Button>
            <Button type="dashed" size="large" block onClick={() => navigateTo('worry')}>
              🆕 首次来访？注册护照
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
