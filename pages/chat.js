import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient} from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import {ButtonSendSticker} from '../src/components/ButtonSendStickers'


const SUPABASE_ANON_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxMzQzMywiZXhwIjoxOTU4ODg5NDMzfQ.CU6hP3Z7eh18DtkxGKVC8pB-3q8cRahIHxbkjnPGnXM';
const SUPABASE_URL = 'https://yninhrbksrwlkyzgjxqg.supabase.co';

const supabaseClient = createClient(SUPABASE_URL,SUPABASE_ANON_KEY);

function escutaMsgTempReal(adicionaMensagem) {
    return supabaseClient
        .from('mensagem')
        .on('INSERT', (respostaLive) => {
            console.log('Houve uma nova mensagem');
            adicionaMensagem(respostaLive.new);
        })
        .subscribe();

}




export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
   
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagem, setListaDeMensagem] = React.useState([
      
    ])
    
    React.useEffect(() =>{
        supabaseClient
        .from('mensagem')
        .select('*')
        .order('id', {ascending: false})
        .then(({data}) =>{
            // console.log('Dados da consulta', data);
             setListaDeMensagem(data);
        })
        escutaMsgTempReal((novaMensagem) => {
            console.log('Nova mensagem', novaMensagem);
            setListaDeMensagem((valorAtualDaLista) => {
                [
                    novaMensagem,
                    ...valorAtualDaLista,
                ]
            })
            
        });
    },[]);

    // ./Sua lógica vai aqui
    function handleNovaMensagem(novaMensagem) {
        
        const mensagem = {
            //id: listaDeMensagem.length + 1,
            de: usuarioLogado,
            texto: novaMensagem
        }

        supabaseClient
            .from('mensagem')
            .insert([ 
                //tem que ser com os mesmos Campos que você escreveu no supabase
            mensagem
             ])
            .then(({ data } ) => {
            // console.log("Criando Mensagem", data);  
        })
        setMensagem('')
    }





    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://github.githubassets.com/images/modules/site/home/footer-illustration.svg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    opacity: 0.9,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '90vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagem={listaDeMensagem} />

                    {/* <MessageList mensagens={[]} /> */}
                    {/* ta mudando o valor : {mensagem} */}
                    {/* {listaDeMensagem.map((mensagemAtual) => {
                       
                       return (
                           <li key={mensagemAtual.id}>
                               {mensagemAtual.de} : {mensagemAtual.texto}
                           </li>
                       )
                       })} */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor)
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault()
                                    handleNovaMensagem(mensagem);
                                }

                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker 
                         onStickerClick={(sticker) => {
                            // console.log('[USANDO O COMPONENTE] Salva esse sticker no banco', sticker);
                            handleNovaMensagem(':sticker: ' + sticker);
                        }}/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    // console.log(props.listaDeMensagem);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagem.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />

                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                            {/* Conficional: {mensagem.texto.startsWith(':sticker:').toString()} */}
                            {mensagem.texto.startsWith(':sticker:')
                            ?(
                                <Image src={mensagem.texto.replace(':sticker:', '') }/>
                            ): 
                            (
                                mensagem.texto
                            )
                                
                        }
                            {/*                                 
                            if mensagem de texto possui sticker: 
                            mostra a imagem
                            else
                                mensagem de texto */}

                                {/* {mensagem.texto} */}

                    </Text>
                );
            })}
        </Box>
    )
}