export const strings = {
  // App general
  appName: 'EventX',
  loading: 'Carregando...',
  error: 'Erro',
  success: 'Sucesso',
  cancel: 'Cancelar',
  save: 'Salvar',
  delete: 'Excluir',
  edit: 'Editar',
  close: 'Fechar',
  confirm: 'Confirmar',
  back: 'Voltar',
  next: 'Próximo',
  
  // Navigation tabs
  navInicio: 'Início',
  navProgramacao: 'Eventos',
  navMapa: 'Mapa',
  navIngressos: 'Ingressos',
  navPerfil: 'Perfil',
  
  // User roles
  roleOrganizador: 'Organizador',
  roleExpositorArtista: 'Expositor/Artista',
  roleParticipante: 'Participante',
  
  // Auth
  login: 'Entrar',
  logout: 'Sair',
  loggingIn: 'Entrando...',
  welcome: 'Bem-vindo',
  setupProfile: 'Configure seu Perfil',
  setupProfileDesc: 'Por favor, complete seu perfil para continuar',
  name: 'Nome',
  email: 'E-mail',
  role: 'Papel',
  selectRole: 'Selecione seu papel',
  namePlaceholder: 'Seu nome completo',
  emailPlaceholder: 'seu@email.com',
  
  // Profile fields
  cnpjCpf: 'CNPJ/CPF',
  cnpjCpfPlaceholder: '00.000.000/0000-00',
  empresa: 'Empresa',
  empresaPlaceholder: 'Nome da sua empresa',
  portfolioUrl: 'Portfólio/Redes Sociais',
  portfolioUrlPlaceholder: 'https://instagram.com/seu-perfil',
  
  // Tickets
  meusIngressos: 'Meus Ingressos',
  validarIngressos: 'Validar Ingressos',
  ticketCode: 'Código do Ingresso',
  ticketValid: 'Ingresso Válido',
  ticketInvalid: 'Ingresso Inválido',
  ticketUsed: 'Ingresso Já Utilizado',
  ticketNotFound: 'Ingresso Não Encontrado',
  scanQR: 'Escanear QR Code',
  enterCode: 'Digite o Código',
  validate: 'Validar',
  noTickets: 'Você ainda não possui ingressos',
  
  // Schedule & Favorites
  minhaAgenda: 'Minha Agenda',
  addToAgenda: 'Adicionar à Agenda',
  removeFromAgenda: 'Remover da Agenda',
  noFavorites: 'Você ainda não adicionou nenhum item à sua agenda',
  
  // Map
  mapaDoEvento: 'Mapa do Evento',
  palcos: 'Palcos',
  estandes: 'Estandes de Tattoo',
  foodTrucks: 'Food Trucks',
  banheiros: 'Banheiros',
  
  // Modules
  espacoTattoo: 'Espaço Tattoo',
  espacoMoto: 'Espaço Moto',
  lineupEPalcos: 'Lineup e Palcos',
  solicitarOrcamento: 'Solicitar Orçamento',
  concursoDeTatuagem: 'Concurso de Tatuagem',
  votar: 'Votar',
  votes: 'votos',
  rotasEComboios: 'Rotas e Comboios',
  areaDeCamping: 'Área de Camping',
  estacionamentoSeguro: 'Estacionamento Seguro',
  meAvise: 'Me Avise',
  
  // Photo wall
  muralDaGalera: 'Mural da Galera',
  uploadPhoto: 'Enviar Foto',
  caption: 'Legenda',
  takePhoto: 'Tirar Foto',
  chooseFile: 'Escolher Arquivo',
  noPhotos: 'Nenhuma foto ainda. Seja o primeiro a compartilhar!',
  
  // Announcements
  avisosImportantes: 'Avisos Importantes',
  avisos: 'Avisos',
  verAvisos: 'Ver Avisos',
  createAnnouncement: 'Criar Aviso',
  priority: 'Prioridade',
  normal: 'Normal',
  important: 'Importante',
  emergency: 'Emergência',
  noAnnouncements: 'Nenhum aviso no momento',
  newAnnouncements: 'Novos avisos',
  
  // Wallet
  minhaCarteira: 'Minha Carteira',
  balance: 'Saldo',
  transactions: 'Transações',
  topUp: 'Recarga',
  spending: 'Gasto',
  noTransactions: 'Nenhuma transação ainda',
  
  // Errors
  unauthorized: 'Não autorizado',
  accessDenied: 'Acesso Negado',
  accessDeniedDesc: 'Você não tem permissão para acessar esta área',
  errorLoading: 'Erro ao carregar',
  tryAgain: 'Tentar Novamente',
  
  // Camera
  cameraError: 'Erro na câmera',
  cameraNotSupported: 'Câmera não suportada neste navegador',
  cameraPermissionDenied: 'Permissão de câmera negada',
  startCamera: 'Iniciar Câmera',
  stopCamera: 'Parar Câmera',
  switchCamera: 'Trocar Câmera',
  capture: 'Capturar',
  
  // Footer
  builtWithLove: 'Feito com',
  by: 'por',
};

export type StringKey = keyof typeof strings;
