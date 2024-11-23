# Exibição do Botão de Mintagem de NFTs Iniciais

Para garantir que o botão **Mintar** funcione corretamente e permita a criação de NFTs iniciais, o desenvolvedor deve configurar o endereço da carteira onde os NFTs serão mintados e também os contratos da blockchain **Amoy**. Siga os passos abaixo para concluir a configuração:

## Informações da Blockchain

- **Blockchain**: Amoy
- **Endereço do contrato do token**: `0x40980B5f4F7609fCD5A00426B6f7716CF5395A84`
- **Endereço do contrato do marketplace**: `0xE9436E39D744eBc67261B34210140ac86381C430`

Esses contratos são essenciais para realizar a mintagem dos NFTs e para a interação com o marketplace.

## Passo 1: Criar o Arquivo .env

No diretório raiz do seu projeto, crie o arquivo `.env` (se ele ainda não existir) e insira as variáveis de ambiente necessárias, como o endereço da carteira e os endereços dos contratos.

**Importante**: quando um novo contrato do TKNMarket for criado, o arquivo `.env` deve ser atualizado para garantir o funcionamento correto do projeto. Além disso, o endereço da conta do proprietário (que realizou o deploy) também precisa ser atualizado.
