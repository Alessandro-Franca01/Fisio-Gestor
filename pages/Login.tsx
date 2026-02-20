import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import api from '../services/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex flex-1 w-full">
        <div className="flex flex-1 flex-col justify-center items-center p-4 sm:p-6 md:p-8 bg-background-light dark:bg-background-dark">
          <div className="flex flex-col w-full max-w-md gap-6">
            <div className="text-center md:text-left">
              <div className="text-primary mb-4">
                <Icon name="exercise" className="text-5xl" />
              </div>
              <h1 className="text-text-light dark:text-text-dark tracking-tight text-[32px] font-bold leading-tight">Acesse sua conta</h1>
              <p className="text-subtle-light dark:text-subtle-dark mt-2">Bem-vindo(a) de volta! Gerencie seus pacientes com facilidade.</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <label className="flex flex-col w-full">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Email</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark h-14 px-4 text-base"
                  placeholder="seuemail@exemplo.com"
                  type="email"
                  name="email"
                />
              </label>
              <label className="flex flex-col w-full">
                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Senha</p>
                <div className="flex w-full flex-1 items-stretch rounded-lg relative">
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark h-14 px-4 pr-12 text-base"
                    placeholder="Sua senha"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-4 text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors"
                  >
                    <Icon name={showPassword ? 'visibility_off' : 'visibility'} />
                  </button>
                </div>
              </label>

              <div className="flex flex-col gap-4 items-center mt-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-text-light text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <span className="truncate">{loading ? 'Entrando...' : 'Entrar'}</span>
                </button>
                <p className="text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal text-center underline cursor-pointer hover:text-primary transition-colors">
                  Esqueci minha senha
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 bg-primary/20 dark:bg-primary/10 relative items-center justify-center">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB7PZCUUA_WP6EnJ3rn6yXwY10QWCzLXZmMn1V7bCGwoRUWPa4HbIiGR-kbdicQkxHS8yriI3yULtbmIeuaUEWxUB4LpQQaBICwtWMgUUKYAv3frE-U5ZyHVYyyMI_ZLduatQctxkzUhjjx7UnIHhlmF78jSA3tCieqNdzDQSz1SBjRtf8n0ujBDG76Ar9Fcj9wtH2sVQ7HP77ne4dFBa0ECEfeValEifnuV0eYqutAIVeCKzq1kiA-aHl6gpc_HhZm8KhRGmXiVW0')", opacity: 0.1 }}></div>
          <div className="z-10 text-center p-12 max-w-md">
            <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Simplificando o seu cuidado</h2>
            <p className="mt-4 text-lg text-subtle-light dark:text-subtle-dark">Foco total no bem-estar dos seus pacientes. Nós cuidamos da organização.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
