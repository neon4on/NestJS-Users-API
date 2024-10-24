# NestJS Users API

## Описание

Этот проект — это REST API на NestJS, который реализует CRUD операции с пользователями. Поддерживает регистрацию, авторизацию через JWT, обновление профиля, удаление пользователей, пагинацию и фильтрацию пользователей по логину.

## Технологии

- **NestJS** - Основной фреймворк для построения сервера
- **PostgreSQL** - СУБД для хранения данных о пользователях
- **TypeORM** - ORM для работы с базой данных
- **JWT** - Авторизация с использованием JSON Web Token
- **Swagger** - Автодокументация API
- **Docker** - Контейнеризация для упрощённого запуска
- **Jest** - Тестирование проекта

## Функционал

- **Регистрация пользователей**
- **Авторизация через JWT**
- **Получение профиля текущего пользователя**
- **Пагинация и фильтрация пользователей**
- **Обновление и удаление пользователей**
- **Полная документация с помощью Swagger**
- **Покрытие основного функционала тестами**

## Требования

- **Docker** версии 20.x или выше
- **Node.js** версии 16.x или выше (если запускать без Docker)

## Установка и запуск проекта

### 1. Клонирование репозитория

```bash
git clone https://github.com/username/nest-users-api.git
cd nest-users-api
```

### 2. Настройка переменных окружения

Создайте файл **.env** в корневой директории и добавьте следующие переменные окружения:

```bash
# Настройки базы данных
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=users_db
POSTGRES_PORT=5432

# Настройки JWT
JWT_SECRET=your_secret_key

# Порт для сервера
PORT=3000
```

### 3. Запуск проекта с использованием Docker

Убедитесь, что у вас установлен Docker.

```bash
docker-compose up --build -d
```

### 4. Запуск проекта локально (без Docker)

Убедитесь, что у вас установлен PostgreSQL и Node.js.

Установите зависимости:
```bash
npm install
```

Запустите сервер:

```bash
npm run start:dev
```

Проект будет доступен по адресу http://localhost:3000.

## Примеры запросов API

### Регистрация пользователя:

```bash
POST /users/register
Body: 
{
  "login": "testuser",
  "email": "testuser@test.com",
  "password": "password123",
  "age": 25,
  "description": "I am a test user"
}
```

### Авторизация:

```bash
POST /users/login
Body:
{
  "login": "testuser",
  "password": "password123"
}
```

### Получение профиля:

```bash
GET /users/profile/my
Headers: Authorization: Bearer <токен>
```

## Запуск тестов

Чтобы запустить все тесты, выполните команду:

```bash
npm run test
```
## Swagger-документация

Полная документация API доступна по адресу http://localhost:3000/api.