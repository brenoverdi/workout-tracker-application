import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          common: {
            save: 'Save Changes',
            cancel: 'Cancel',
            close: 'Close',
            search: 'Search...',
            all: 'All',
            noResults: 'No results found.',
            loading: 'Loading...',
            add: 'Add',
            start: 'Start',
            select: 'Select',
            back: 'Back'
          },
          menu: {
            dashboard: 'Dashboard',
            workout: 'Active Workout',
            history: 'History',
            exercises: 'Exercises',
            tutorials: 'Tutorials',
            coach: 'AI Coach',
            settings: 'Settings',
            logout: 'Sign Out'
          },
          dashboard: {
            welcome: 'Welcome back!',
            startWorkout: 'Start New Workout',
            trainingLoad: 'Training Load Overview',
            recentActivity: 'Recent Activity',
            stats: {
                totalWorkouts: 'Total Workouts',
                averageDuration: 'Avg. Duration',
                totalVolume: 'Total Volume',
                streak: 'Day Streak'
            },
            modal: {
                title: 'Start Workout',
                description: 'Select a program to follow or start a free session.',
                freeSession: 'Free Session',
                freeSessionDesc: 'Log exercises on the fly without a fixed plan.',
                selectProgram: 'Select a Program',
                searchPrograms: 'Search programs...',
            }
          },
          settings: {
            title: 'Settings',
            description: 'Manage your account and preferences.',
            profile: 'Public Profile',
            profileDesc: 'Update your personal information and stats.',
            fullName: 'Full Name',
            email: 'Email Address',
            weight: 'Current Weight (kg)',
            height: 'Height (cm)',
            save: 'Save Changes',
            notifications: 'Notifications',
            notificationsDesc: 'Change how you get alerts',
            security: 'Security',
            securityDesc: 'Manage password and access',
            appPreferences: 'App Preferences',
            appPreferencesDesc: 'Theme and localization',
            darkMode: 'Dark Mode',
            language: 'Language',
            logout: 'Log Out',
            logoutDesc: 'Sign out of your account on this device'
          },
          history: {
            title: 'Sessions History',
            empty: 'No workout sessions found yet. Get training!',
            completed: 'Completed',
            inProgress: 'In Progress',
            exercises: 'Exercises'
          }
        },
      },
      es: {
        translation: {
          common: {
            save: 'Guardar Cambios',
            cancel: 'Cancelar',
            close: 'Cerrar',
            search: 'Buscar...',
            all: 'Todos',
            noResults: 'No se encontraron resultados.',
            loading: 'Cargando...',
            add: 'Añadir',
            start: 'Empezar',
            select: 'Seleccionar',
            back: 'Volver'
          },
          menu: {
            dashboard: 'Tablero',
            workout: 'Entrenamiento Activo',
            history: 'Historial',
            exercises: 'Ejercicios',
            tutorials: 'Tutoriales',
            coach: 'Entrenador IA',
            settings: 'Ajustes',
            logout: 'Cerrar Sesión'
          },
          dashboard: {
            welcome: '¡Bienvenido de nuevo!',
            startWorkout: 'Empezar Entrenamiento',
            trainingLoad: 'Carga de Entrenamiento',
            recentActivity: 'Actividad Reciente',
            stats: {
                totalWorkouts: 'Entrenamientos Totales',
                averageDuration: 'Duración Media',
                totalVolume: 'Volumen Total',
                streak: 'Racha de Días'
            },
            modal: {
                title: 'Empezar Entrenamiento',
                description: 'Selecciona un programa para seguir o empieza una sesión libre.',
                freeSession: 'Sesión Libre',
                freeSessionDesc: 'Registra ejercicios sobre la marcha sin un plan fijo.',
                selectProgram: 'Seleccionar un Programa',
                searchPrograms: 'Buscar programas...',
            }
          },
          settings: {
            title: 'Ajustes',
            description: 'Administra tu cuenta y preferencias.',
            profile: 'Perfil Público',
            profileDesc: 'Actualiza tu información personal y estadísticas.',
            fullName: 'Nombre Completo',
            email: 'Correo Electrónico',
            weight: 'Peso Actual (kg)',
            height: 'Altura (cm)',
            save: 'Guardar Cambios',
            notifications: 'Notificaciones',
            notificationsDesc: 'Cambia cómo recibes alertas',
            security: 'Seguridad',
            securityDesc: 'Gestiona contraseña y acceso',
            appPreferences: 'Preferencias de la App',
            appPreferencesDesc: 'Tema y localización',
            darkMode: 'Modo Oscuro',
            language: 'Idioma',
            logout: 'Cerrar Sesión',
            logoutDesc: 'Cierra la sesión en este dispositivo'
          },
          history: {
            title: 'Historial de Sesiones',
            empty: 'Aún no hay sesiones. ¡Empieza a entrenar!',
            completed: 'Completado',
            inProgress: 'En Progreso',
            exercises: 'Ejercicios'
          }
        },
      },
      pt: {
        translation: {
          common: {
            save: 'Salvar Alterações',
            cancel: 'Cancelar',
            close: 'Fechar',
            search: 'Buscar...',
            all: 'Todos',
            noResults: 'Nenhum resultado encontrado.',
            loading: 'Carregando...',
            add: 'Adicionar',
            start: 'Iniciar',
            select: 'Selecionar',
            back: 'Voltar'
          },
          menu: {
            dashboard: 'Dashboard',
            workout: 'Treino Ativo',
            history: 'Histórico',
            exercises: 'Exercícios',
            tutorials: 'Tutoriais',
            coach: 'Coach IA',
            settings: 'Configurações',
            logout: 'Sair'
          },
          dashboard: {
            welcome: 'Bem-vindo de volta!',
            startWorkout: 'Iniciar Novo Treino',
            trainingLoad: 'Carga de Treinamento',
            recentActivity: 'Atividade Recente',
            stats: {
                totalWorkouts: 'Total de Treinos',
                averageDuration: 'Duração Média',
                totalVolume: 'Volume Total',
                streak: 'Sequência de Dias'
            },
            modal: {
                title: 'Iniciar Treino',
                description: 'Selecione um programa para seguir ou inicie uma sessão livre.',
                freeSession: 'Sessão Livre',
                freeSessionDesc: 'Registre exercícios conforme o treino sem um plano fixo.',
                selectProgram: 'Selecionar um Programa',
                searchPrograms: 'Buscar programas...',
            }
          },
          settings: {
            title: 'Configurações',
            description: 'Gerencie sua conta e preferências.',
            profile: 'Perfil Público',
            profileDesc: 'Atualize suas informações pessoais e estatísticas.',
            fullName: 'Nome Completo',
            email: 'E-mail',
            weight: 'Peso Atual (kg)',
            height: 'Altura (cm)',
            save: 'Salvar Alterações',
            notifications: 'Notificações',
            notificationsDesc: 'Altere como você recebe alertas',
            security: 'Segurança',
            securityDesc: 'Gerencie senha e acesso',
            appPreferences: 'Preferências da App',
            appPreferencesDesc: 'Tema e localização',
            darkMode: 'Modo Escuro',
            language: 'Idioma',
            logout: 'Sair',
            logoutDesc: 'Sair da sua conta neste dispositivo'
          },
          history: {
            title: 'Histórico de Sessões',
            empty: 'Nenhuma sessão encontrada. Vamos treinar!',
            completed: 'Concluído',
            inProgress: 'Em Andamento',
            exercises: 'Exercícios'
          }
        },
      },
    },
  });

export default i18n;
