# Rentx

[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/italocc-git/nodejs-rentx/blob/main/LICENSE)

# Sobre o projeto
API de aluguel de carros, desenvolvida durante o Ignite de NodeJS da Rocketseat.

A Aplicação consiste em gerenciar um sistema de aluguel de carros, onde é possível realizar o aluguel de uma ou mais diárias para o veículo selecionado
pelo usuário cadastrado. Aplicação possui os seguintes principais recursos : Cadastramento e Listagem de carros por categorias e especificações, autenticação e cadastro dos usuários, recuperação de senha via e-mail, gerenciamento de aluguel de carros e acionamento de multa automático após devolução fora do prazo.

# Tecnologias utilizadas

 <li> Express </li>
 <li> Bcryptjs / jsonwebtoken </li>
 <li> multer  </li>
 <li> Dayjs </li>
 <li> Handlebars </li>
 <li> Jest/ Supertest </li>
 <li> Swagger-ui-express </li>

# Requisitos Funcionais , Não funcionais e Regras de negócio

## Cadastro de carro

**RF**
- Deve ser possível cadastrar um novo carro.

**RN** 
- Não deve ser possível cadastrar um carro com uma placa já existente.
- O carro deve ser cadastrado, por padrão, com disponibilidade.
- O usuário responsável pelo cadastro deve ser um usuário administrador.

# Listagem de carros

**RF** 
- Deve ser possível listar todos os carros disponíveis
- Deve ser possível listar todos os carros disponíveis pelo - nome da categoria
- Deve ser possível listar todos os carros disponíveis pelo - nome da marca
- Deve ser possível listar todos os carros disponíveis pelo - nome do carro

**RN**
- O usuário não precisar estar logado no sistema.


# Cadastro de Especificação no carro

**RF**
- Deve ser possível cadastrar uma especificação para um carro


**RN**
- Não deve ser possível cadastrar uma especificação para um - carro não cadastrado.
- Não deve ser possível cadastrar uma especificação já - existente para o mesmo carro.
- O usuário responsável pelo cadastro deve ser um usuário - administrador.


# Cadastro de imagens do carro

**RF**
- Deve ser possível cadastrar a imagem do carro

**RNF**
- Utilizar o multer para upload dos arquivos

**RN**
- O usuário deve poder cadastrar mais de uma imagem para o - mesmo carro
- O usuário responsável pelo cadastro deve ser um usuário - administrador.


# Alugel de carro

**RF**
- Deve ser possível cadastrar um aluguel


**RN**
- O aluguel deve ter duração mínima de 24 horas.
- Não deve ser possível cadastrar um novo aluguel caso já - exista um aberto para o mesmo usuário
- Não deve ser possível cadastrar um novo aluguel caso já - exista um aberto para o mesmo carro
- O usuário deve estar logado na aplicação
- Ao realizar um aluguel, o status do carro deverá ser - alterado para indisponível


# Devolução de carro 

**RF**
- Deve ser possível realizar a devolução de um carro

**RN**
- Se o carro for devolvido com menos de 24 horas, deverá - ser cobrado diária completa.
- Ao realizar a devolução, o carro deverá ser liberado para - outro aluguel.
- Ao realizar a devolução, o usuário deverá ser liberado - para outro aluguel.
- Ao realizar a devolução, deverá ser calculado o total do - aluguel. 
- Caso o horário de devolução seja superior ao horário - previsto de entrega, deverá ser cobrado multa - proporcional aos dias de atraso.
- Caso haja multa, deverá ser somado ao total do aluguel.
- O usuário deve estar logado na aplicação


# Listagem de Alugueis para usuário

**RF**
- Deve ser possível realizar a busca de todos os alugueis para o usuário

**RN**
- O usuário deve estar logado na aplicação


# Recuperar Senha

**RF**
- Deve ser possível o usuário recuperar a senha informando o e-mail
- O usuário deve receber um e-mail com o passo a passo para a recuperação da senha
- O usuário deve conseguir inserir uma nova senha

**RN**
- O usuário precisa informar uma nova senha
- O link enviado para a recuperação deve expirar em 3 horas

 # Como executar o projeto (Siga as orientações na ordem)
 
 Pré-requisitos: npm / yarn , Docker


### Clonar repositório
```
$ git clone https://github.com/italocc-git/nodejs-rentx.git
```

### Entrar na pasta do projeto rentx
```
$ cd rentx
```

### Instalar dependências
```
$ yarn install / npm install
```

### Configurando Banco de dados
A aplicação usa dois banco de dados: [Postgres](https://www.postgresql.org/) e [Redis](https://redis.io/). Para a configuração mais rápida é recomendado usar [docker-compose](https://docs.docker.com/compose/), você só precisa fazer o up de todos os serviços:
```
$ docker-compose up -d
```

### Migrations
Antes de rodar a aplicação :

```
$ yarn typeorm migration:run
```
> Veja mais informações sobre [TypeORM Migrations](https://typeorm.io/#/migrations).

### `.env`
Neste arquivo, você deve configurar sua conexão do banco de dados Redis e Postgres, JWT, email, sentry, storage e configurações de AWS (caso seja necessário).
Renomeie o `.env.example` no diretório raiz para `.env` e então atualize com suas configurações.

### Rodando o projeto

```
yarn server / npm run server
```

### Rodando os testes
```
yarn test / npm run test
```

### Coverage report
Você pode ver o coverage report dentro de `coverage`. Ele é criado automaticamente após a execução dos testes.

# Autor

Italo Costa Cavalcante

https://www.linkedin.com/in/italo-costa-cavalcante/
