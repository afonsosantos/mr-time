/**
 * RelogioParadise
 * Simple bot that shows a clock and temperature for a RP Discord server
 *
 * Afonso Santos - 2019
 */

/*
 * Importação de pacotes NPM
 */
const Discord = require('discord.js');
var moment = require('moment');

moment.locale('pt');
require('dotenv').config();

// Variáveis
var hora,
  temperatura = 10,
  meteorologia = 'Vento Gelado',
  mensagem = '',
  recompensa = '',
  quest = [];

/*
 * Initialização de objetos e variáveis
 */
const client = new Discord.Client();
const prefix = process.env.PREFIX;

// Quando o bot estiver pronto
client.on('ready', () => {
  console.log('Bot pronto!');
});

/*
 * Funções personalizadas
 */

// Atualização da hora
function atualizarHora() {
  hora = moment()
    .subtract(process.env.DIF_HORAS, 'hour')
    .format('LT');

  // Mensagem das quests auto
  if (hora == '11:00') {
    enviarMensagemQuestsAbertas();
  } else if (hora == '17:00') {
    client.channels.get(process.env.ID_CANAL_MENSAGEM_AUTO_QUESTS).send(`${prefix}clear`);
  } else if (hora == '17:01') {
    enviarMensagemQuestsFechadas();
  }

  client.user.setActivity(`Hora: ${hora}`);
  // console.log(hora);
}

// Mensagem periódica
function enviarMensagem() {
  const mensagemAuto = new Discord.RichEmbed()
    .setColor('#77185e')
    .setTitle('Informações Gerais')
    .setAuthor('Mr. Time', 'https://i.imgur.com/2r3EbTF.png', 'https://github.com/afonsosantos')
    .setThumbnail('https://i.imgur.com/3ZDiLHR.png')
    .addField('Hora', `São ${hora}`, true)
    .addField('Meteorologia', `${meteorologia}`, true)
    .addField('Temperatura', `Estão ${temperatura} graus`)
    .setTimestamp()
    .setFooter('Bot por Afonso Santos', 'https://i.imgur.com/1LHooWF.png');

  client.channels.get(process.env.ID_CANAL_MENSAGEM_AUTO).send(mensagemAuto);
  console.log('Mensagem automática enviada!');
}

// Mensagem das quests abertas
function enviarMensagemQuestsAbertas() {
  const mensagemAuto = new Discord.RichEmbed()
    .setColor('#77185e')
    .setTitle('Quests Abertas')
    .setAuthor('Mr. Time', 'https://i.imgur.com/2r3EbTF.png', 'https://github.com/afonsosantos')
    .setThumbnail('https://i.imgur.com/3ZDiLHR.png')
    .addBlankField()
    .addField('Descrição', mensagem, true)
    .addField('Recompensa', recompensa, true)
    .setTimestamp()
    .setFooter('Bot por Afonso Santos', 'https://i.imgur.com/1LHooWF.png');

  client.channels.get(process.env.ID_CANAL_MENSAGEM_AUTO_QUESTS).send(mensagemAuto);
  console.log(`Mensagem automática das quests enviada! (estado: abertas)`);
}

// Mensagem das quests fechadas
function enviarMensagemQuestsFechadas() {
  const mensagemAuto = new Discord.RichEmbed()
    .setColor('#77185e')
    .setTitle('Quests Fechadas')
    .setAuthor('Mr. Time', 'https://i.imgur.com/2r3EbTF.png', 'https://github.com/afonsosantos')
    .setThumbnail('https://i.imgur.com/3ZDiLHR.png')
    .addBlankField()
    .addField('As quests fecharam!', 'Obrigado pela participação')
    .setTimestamp()
    .setFooter('Bot por Afonso Santos', 'https://i.imgur.com/1LHooWF.png');

  client.channels.get(process.env.ID_CANAL_MENSAGEM_AUTO_QUESTS).send(mensagemAuto);
  console.log(`Mensagem automática das quests enviada! (estado: fechadas)`);
}

// Custom Presence e mensagem da hora
setInterval(atualizarHora, process.env.INTERVAL_UPDATE_HORA);
setInterval(enviarMensagem, process.env.INTERVAL_ENVIO_MENSAGEM);

/*
 * Embeds
 */
const ajuda = new Discord.RichEmbed()
  .setColor('#77185e')
  .setTitle('Lista de Comandos')
  .setAuthor('Mr. Time', 'https://github.com/afonsosantos')
  .setDescription('Lista de comandos disponíveis')
  .setThumbnail('https://i.imgur.com/2r3EbTF.png')
  .addField(`**${prefix}hora**`, 'Mostra a hora atual')
  .addField(`**${prefix}temp**`, 'Mostra a temperatura atual')
  .addField(`**${prefix}meteo**`, 'Mostra a meteorologia atual')
  .addField(`**${prefix}defmeteo**`, 'Define uma temperatura e meteorologia (args: <temp> <meteorologia>)')
  .addField(`**${prefix}auto**`, 'Mostra uma mensagem com a hora, meteorologia e temperatura')
  .addField(`**${prefix}ajuda**`, 'Mostra esta mensagem')
  .setTimestamp()
  .setFooter('Bot por Afonso Santos', 'https://i.imgur.com/1LHooWF.png');

/*
 * Lista de Comandos
 */
client.on('message', message => {
  // Validation
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (message.content.startsWith(prefix + 'hora')) {
    message.channel.send(`Hora Atual: **${hora}**`);
  } else if (message.content.startsWith(prefix + 'temp')) {
    message.channel.send(`Temperatura: **${temperatura} ºC**`);
  } else if (message.content.startsWith(prefix + 'meteo')) {
    message.channel.send(`Meteorologia: **${meteorologia}**`);
  } else if (command == 'defmeteo') {
    // Verifica se a mensagem tem os argumentos
    if (!args.length) {
      return message.channel.send(`Tem de especificar qual a temperatura e a meteorologia para definir ${message.author}!`);
    }
    temperatura = args[0];
    meteorologia = args[1];
    message.channel.send(`Temperatura definida para **${temperatura} ºC** e **${meteorologia}** como meteorologia.`);
  } else if (message.content.startsWith(prefix + 'ajuda')) {
    message.channel.send(ajuda);
  } else if (message.content.startsWith(prefix + 'auto')) {
    enviarMensagem();
  } else if (message.content.startsWith(prefix + 'abertas')) {
    enviarMensagemQuestsAbertas();
  } else if (message.content.startsWith(prefix + 'fechadas')) {
    enviarMensagemQuestsFechadas();
  } else if (message.content.startsWith(prefix + 'addquest')) {
    // Descrição da quest
    var quest = [];
    message.channel.send('Insira o nome e a recompensa para a quest, em separado.');
    const filter = m => m.content.includes('discord');
    const collector = message.channel.createMessageCollector(filter, { time: 5000 });

    collector.on('collect', m => {
      mensagem = m.content;
      if (mensagem.length > 0) {
        message.channel.send('Enviou uma mensagem!');
      }
    });

    collector.on('end', collected => {
      console.log(collected);
    });
  } else {
    // Opção padrão
    message.channel.send(`${message.author}, esse comando não existe. **${prefix}ajuda** para uma lista de comandos`);
  }
});

// Login
client.login();
