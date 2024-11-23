# Configuração do Botão de Mintar NFTs Iniciais

Para que o botão **Mintar** funcione corretamente e possa criar NFTs iniciais, o desenvolvedor precisa configurar o endereço da carteira onde os NFTs serão mintados, além de configurar os contratos da blockchain "Amoy". Siga os passos abaixo para realizar a configuração:

## Informações da Blockchain

- **Nome da Blockchain**: Amoy
- **Endereço do contrato do token**: `0x40980B5f4F7609fCD5A00426B6f7716CF5395A84`
- **Endereço do contrato do marketplace**: `0xE9436E39D744eBc67261B34210140ac86381C430`

Esses contratos são usados para realizar as operações de mintagem e interação com o marketplace.

## Passo 1: Criar o arquivo `.env`

No diretório raiz do seu projeto, crie um arquivo chamado `.env` (caso não exista) e adicione as variáveis de ambiente com o endereço da carteira e os endereços dos contratos.

Exemplo:

```env
VITE_OWNER_ADDRESS=0xSeuEnderecoDeCarteiraAqui
VITE_TOKEN_CONTRACT_ADDRESS=0x40980B5f4F7609fCD5A00426B6f7716CF5395A84
VITE_MARKETPLACE_CONTRACT_ADDRESS=0xE9436E39D744eBc67261B34210140ac86381C430

**Importante:** Para novos contratos TKNMarket, é necessário alterar o arquivo `.env` com os respectivos endereços do contrato. Além disso, a conta que realizar o deploy deve ser a mesma informada no `.env` (ou seja, o endereço configurado em `VITE_OWNER_ADDRESS`).

