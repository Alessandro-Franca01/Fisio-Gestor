
import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'app' | 'clinic'>('profile');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <div className="mx-auto max-w-5xl">
            <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">Configurações</h1>
                    <p className="text-subtle-light dark:text-subtle-dark text-base font-normal leading-normal">Gerencie sua conta, preferências e dados da clínica.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-6 bg-primary text-background-dark text-sm font-bold leading-normal tracking-wide shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
                >
                    {isSaving ? (
                        <span className="flex items-center gap-2 animate-pulse"><Icon name="hourglass_top" /> Salvando...</span>
                    ) : (
                        <span className="flex items-center gap-2"><Icon name="check_circle" /> Salvar Alterações</span>
                    )}
                </button>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar de Abas */}
                <nav className="flex flex-row lg:flex-col gap-2 min-w-[240px] overflow-x-auto pb-2 lg:pb-0">
                    {[
                        { id: 'profile', label: 'Meu Perfil', icon: 'account_circle' },
                        { id: 'security', label: 'Segurança', icon: 'security' },
                        { id: 'clinic', label: 'Dados da Clínica', icon: 'business' },
                        { id: 'app', label: 'Preferências do App', icon: 'palette' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold whitespace-nowrap
                ${activeTab === tab.id
                                    ? 'bg-primary text-background-dark shadow-md scale-[1.02]'
                                    : 'bg-surface-light dark:bg-surface-dark text-subtle-light dark:text-subtle-dark hover:bg-primary/10'}
              `}
                        >
                            <Icon name={tab.icon as any} />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Conteúdo da Aba */}
                <div className="flex-1 space-y-6">
                    {activeTab === 'profile' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                            <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-6 flex items-center gap-2">
                                    <Icon name="account_circle" /> Perfil Profissional
                                </h3>
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="relative group cursor-pointer">
                                        <div className="size-24 rounded-full bg-surface-light dark:bg-surface-dark border-4 border-primary/20 flex items-center justify-center text-subtle-light dark:text-subtle-dark">
                                            <Icon name="person" className="text-5xl" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Icon name="upload_file" className="text-white text-xl" />
                                        </div>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">Nome Completo</span>
                                            <input className="form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-primary h-11" defaultValue="Carlos Silva" />
                                        </label>
                                        <label className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">E-mail Profissional</span>
                                            <input className="form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-primary h-11" defaultValue="carlos.silva@fisiogestor.com" />
                                        </label>
                                        <label className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">Registro Profissional (CREFITO)</span>
                                            <input className="form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-primary h-11" defaultValue="123456-F" />
                                        </label>
                                        <label className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">Especialidade Principal</span>
                                            <select className="form-select rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-primary h-11">
                                                <option>Fisioterapia Traumato-Ortopédica</option>
                                                <option>Fisioterapia Esportiva</option>
                                                <option>Neurofuncional</option>
                                                <option>Respiratória</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                            <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-6 flex items-center gap-2">
                                    <Icon name="security" /> Segurança da Conta
                                </h3>
                                <div className="max-w-md space-y-4">
                                    <label className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">Senha Atual</span>
                                        <input className="form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-11" type="password" placeholder="••••••••" />
                                    </label>
                                    <label className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">Nova Senha</span>
                                        <input className="form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-11" type="password" />
                                    </label>
                                    <label className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">Confirmar Nova Senha</span>
                                        <input className="form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-11" type="password" />
                                    </label>
                                    <button className="text-sm font-bold text-primary hover:underline mt-2">Esqueceu sua senha?</button>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'clinic' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                            <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-6 flex items-center gap-2">
                                    <Icon name="business" /> Dados da Clínica Principal
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex flex-col gap-1 md:col-span-2">
                                        <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">Nome da Clínica / Consultório</span>
                                        <input className="form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-11" defaultValue="FisioVida Central" />
                                    </label>
                                    <label className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">CNPJ (Opcional)</span>
                                        <input className="form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-11" placeholder="00.000.000/0001-00" />
                                    </label>
                                    <label className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">Telefone de Contato</span>
                                        <input className="form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-11" defaultValue="(11) 3456-7890" />
                                    </label>
                                    <label className="flex flex-col gap-1 md:col-span-2">
                                        <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">Endereço Completo</span>
                                        <input className="form-input rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-11" defaultValue="Av. Paulista, 1000 - São Paulo, SP" />
                                    </label>
                                </div>
                            </section>
                        </div>
                    )}


                    {activeTab === 'app' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                            <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-6 flex items-center gap-2">
                                    <Icon name="palette" /> Personalização e Idioma
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-3">
                                        <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">Tema do Sistema</span>
                                        <div className="flex gap-4">
                                            <button className="flex-1 border-2 border-primary rounded-xl p-4 flex flex-col items-center gap-2 bg-background-light text-text-light">
                                                <Icon name="visibility" /> Claro
                                            </button>
                                            <button className="flex-1 border-2 border-border-light dark:border-border-dark rounded-xl p-4 flex flex-col items-center gap-2 bg-background-dark text-text-dark">
                                                <Icon name="visibility" filled /> Escuro
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-subtle-light dark:text-subtle-dark uppercase">Idioma</span>
                                            <select className="form-select rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-11" disabled>
                                                <option>Português (Brasil)</option>
                                                <option>English (US)</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-6 flex items-center gap-2">
                                    <Icon name="notifications" /> Notificações
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark last:border-0">
                                        <div>
                                            <p className="font-bold text-text-light dark:text-text-dark">Lembretes por WhatsApp</p>
                                            <p className="text-xs text-subtle-light dark:text-subtle-dark">Enviar mensagem automática aos pacientes 24h antes.</p>
                                        </div>
                                        <input type="checkbox" className="form-checkbox size-6 rounded text-primary focus:ring-primary" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark last:border-0">
                                        <div>
                                            <p className="font-bold text-text-light dark:text-text-dark">Resumo Financeiro Semanal</p>
                                            <p className="text-xs text-subtle-light dark:text-subtle-dark">Receber no e-mail um relatório de pagamentos e pendências.</p>
                                        </div>
                                        <input type="checkbox" className="form-checkbox size-6 rounded text-primary focus:ring-primary" defaultChecked />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
