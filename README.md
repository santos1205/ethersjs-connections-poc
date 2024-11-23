# Exibição do Botão de Mintagem de NFTs Iniciais

Para garantir que o botão **Mintar** funcione corretamente e permita a criação de NFTs iniciais, o desenvolvedor deve configurar o endereço da carteira onde os NFTs serão mintados e também os contratos da blockchain **Amoy**. Siga os passos abaixo para concluir a configuração:

## Informações da Blockchain

- **Blockchain**: Amoy
- **Endereço do contrato do token**: `0x6b4b30fd39082C1DB5727eEd04FEdA091D46D3b8`
- **Endereço do contrato do marketplace**: `0x6a095F22B6d23583207CBbBcAF707F7D82154DA0`

Esses contratos são essenciais para realizar a mintagem dos NFTs e para a interação com o marketplace.

## Passo 1: Criar o Arquivo .env

No diretório raiz do seu projeto, crie o arquivo `.env` (se ele ainda não existir) e insira as variáveis de ambiente necessárias, como o endereço da carteira e os endereços dos contratos.

**Importante**: quando um novo contrato do TKNMarket for criado, o arquivo `.env` deve ser atualizado para garantir o funcionamento correto do projeto. Além disso, o endereço da conta do proprietário (que realizou o deploy) também precisa ser atualizado.

Todo o conteúdo dos tokens (RWAs) de carro é carregado do **META-DADO** proveniente da blockchain. Isso significa que as informações dos tokens são dinâmicas e dependem do que está registrado no meta-dado da blockchain, garantindo dados atualizados e consistentes.
