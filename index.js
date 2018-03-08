const Discord = require("discord.js");
const PREFIX = "==";
const YTDL = require("ytdl-core");
const antispam = require("discord-anti-spam");
const db = require("quick.db")
const economy = require("discord-eco")
const YouTube = require("simple-youtube-api")
const superagent = require("superagent")
const moment = require("moment")
const fs = require("fs")
var Jimp = require("jimp");
var request = require('request');

const fortnite = require("fortnite.js")
const joueur = new fortnite("249fcf34-1945-43c6-91ce-7232f81958be")

var bot = new Discord.Client();

bot.mutes = require("./mutes.json")

const modrole = "Modérateur";

var client = new Discord.Client();

const youtube = new YouTube("AIzaSyDE684AY4Th50yKvN7lZ9GroJiFvF5yjy8");

const queue = new Map();

function generateHex() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function roll() {
   return Math.floor(Math.random() * 99999) + 1;
}

var roll = Math.floor(Math.random() * 99999) + 1;

var fortunes = [
    "Oui.",
    "Non.",
    "Sûrment.",
    "Je ne pense pas.",
    "T'es malade ou quoi ? Jamais mec.",
    "Aspèrge",
    "Je sais pas.",
    "Pourquoi tu me demandes ça ?"
];


var servers = {};

bot.on("ready", function () {
        bot.user.setActivity("la ShifTeam <3", {url:"https://www.twitch.tv/zelkibot", type: "WATCHING"})
    console.log("Je suis prêt à me rendre sur " + bot.guilds.size + " serveur(s) ! Sous le pseudo de " + bot.user.username + " !");
});

bot.on("message", async function(message) {

    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;
    
    if (message.channel.type === "dm") return message.reply("Salut " + message.author.username + ", je suis désolé mais je ne peux pas répondre en MP.");

    var args = message.content.substring(PREFIX.length).split (" ");

    var args2 = message.content.split(" ").slice(1);

    var suffix = args2.join(" ");

    var reason = args2.slice(1).join(" ");

    var user = message.mentions.users.first();

    var guild = message.guild;

    var member = message.member;

    var rolemodo = member.guild.roles.find("name", "Modérateur")

    var rolehelper = member.guild.roles.find("name", "Helper")

    var roleyoutube = member.guild.roles.find("name", "YOUTUBE")
    
    var rolefriend = member.guild.roles.find("name", "AMIGO")

    var rolemute = member.guild.roles.find("name", "Mute")

    var modlog = member.guild.channels.find("name", "mod-log")

    var midlemanrole = member.guild.roles.find("name", "Midleman")

    var regleschannel = member.guild.channels.find("name", "regles")

    var cont = message.content.slice(PREFIX.length).split(" ");

    var args3 = cont.slice(1);
    
    const serverQueue = queue.get(message.guild.id);

    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    switch (args[0].toLowerCase()) {
        case "unmute":
        if (!message.member.roles.find("name", modrole)) {
                    message.channel.send("Tu as besoin du role `" + modrole + "` pour faire cette commande.");
                return;
                }
        if(!modlog) return message.reply("Je ne trouve pas de channel mod-log.");
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser qui je dois unmute.")
        if (reason.length < 1) return message.reply("Tu as oublié la raison.");
        member.removeRole(rolemute)
        message.channel.send("Il a bien été unmute")

        var embed = new Discord.MessageEmbed()
        .addField("Action :", "Unmute")
        .addField("Utilisateur :", user.toString())
        .addField("Modérateur :", message.author.toString())
        .addField("Raison :", reason)
        .setColor(0x808000)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "mod-log").send(embed);
        break;
        case "mute":
        if (!message.member.roles.find("name", modrole)) {
                    message.channel.send("Tu as besoin du role `" + modrole + "` pour faire cette commande.");
                return;
                }
        if(!modlog) return message.reply("Je ne trouve pas de channel mod-log.");
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser qui je dois Mute.")
        if (reason.length < 1) return message.reply("Tu as oublié la raison.");
        member.addRole(rolemute)

        bot.mutes[user.id] = {
            guild: message.guild.id,
            time: Date.now() + parseInt(args2[1]) * 1000
        }

        fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
            if(err) throw err;
            message.channel.send("Je l'ai mute.")
        })

        var embed = new Discord.MessageEmbed()
        .addField("Action :", "Mute")
        .addField("Utilisateur :", user.toString())
        .addField("Modérateur :", message.author.toString())
        .addField("Raison :", reason)
        .setColor(0x808000)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "mod-log").send(embed);
        break;
        case "help":
            member.send(`
__***Commandes disponibles sur le bot.***__

__**General**__

**help** : Message que tu vois maintenant !

__**Musique**__
**play** : Ajouté une musique à la playlist, sois l'a joué sur le champ. Utilisation : _play <lien / nom de la musique>
**stop** : Arrêté la / les musique(s) en cours.
**skip** : Passer à la musique suivante.
**queue** : Voir les musiques dans la playlist.
**volume** : Changer le volume. Utilisation : _volume <1 / 2 / 3 / 4 / 5>. Vous n'êtes pas obligé de mettre un nombre, si vous n'en mettez pas, le bot vous montrera le volume courent.
**np** : Voir la musique en cours.
**pause** : Mettre la musique en pause.
**unpause** : Redémarrer la musique.

__**Informations**__
**userinfo** : Informations sur un utilisateur. Utilisation : _userinfo @utilisateur
**serverinfo** : Informations sur le serveur sur le quel tu te trouves.

__**Modération**__
**ban** : Bannir un utilisateur. Utilisation : _ban @utilisateur <raison>
**kick** : Kick un utilisateur. Utilisation : _kick @utilisateur <raison>
**mute** : Mute un utilisateur. Utilisation : _mute @utilisatuer <temps en minutes> <raison>
**unmute** : Unmute un utilisateur. Utilisation : _unmute @utilisateur
**purge** : Supprimer un certain nombre de messages. Utilisation : _purge <nombre de messages (minimum 2 et maximum 100).
            `)
            message.react("✅")
            message.channel.send(member.toString() + " Je t'ai envoyé les commandes en MP !")
            break;
        case "userinfo":
            if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser de qui je dois montrer les informations.")
            var embed = new Discord.MessageEmbed()
                .addField("Pseudo", user.tag)
                .addField("Surnom", user.nickname || "none")
                .addField("ID", user.id)
                .addField("Compte créer le", user.createdAt)
                .addField("Roles", message.guild.member(user).roles.sort().map(role => role).join(" | "))
                .setThumbnail(user.avatarURL)
                .setColor(0xff80ff)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setFooter("Voilà.", message.author.avatarURL)
                .setTimestamp()
            message.channel.send(embed);
            break;
        case "kick":
            if (!message.member.roles.find("name", modrole)) {
                    message.channel.send("Tu as besoin du role `" + modrole + "` pour faire cette commande.");
                return;
                }
            if(!modlog) return message.reply("Je ne trouve pas de channel mod-log.");
            if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser qui je dois kick.")
            if (reason.length < 1) return message.reply("Tu as oublié la raison.");
            message.guild.member(user).kick();

            var embed = new Discord.MessageEmbed()
            .addField("Action :", "kick")
            .addField("Utilisateur :", user.toString())
            .addField("Modérateur :", message.author.toString())
            .addField("Raison :", reason)
            .setColor(0x800000)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTimestamp()
            member.guild.channels.find("name", "mod-log").send(embed);
            break;
        case "ban":
            if (!message.member.roles.find("name", modrole)) {
                    message.channel.send("Tu as besoin du role `" + modrole + "` pour faire cette commande.");
                return;
                }
            if(!modlog) return message.reply("Je ne trouve pas de channel mod-log.");
            if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser qui je dois bannir.")
            if (reason.length < 1) return message.reply("Tu as oublié la raison.");
            message.guild.ban(user, 2);

            var embed = new Discord.MessageEmbed()
            .addField("Action :", "ban")
            .addField("Utilisateur :", user.toString())
            .addField("Modérateur :", message.author.toString())
            .addField("Raison :", reason)
            .setColor(0x0000ff)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTimestamp()
            member.guild.channels.find("name", "mod-log").send(embed);
            break;
        case "purge":
            if (!message.member.roles.find("name", modrole)) {
                    message.channel.send("Tu as besoin du role `" + modrole + "` pour faire cette commande.");
                return;
                }
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));

            var embed = new Discord.MessageEmbed()
            .addField("Action :", "supression de messages")
            .addField("Modérateur :", message.author.toString())
            .addField("Nombre de messages :", messagecount)
            .setColor(0x0000ff)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTimestamp()
            member.guild.channels.find("name", "mod-log").send(embed);
            break;
        case "serverinfo":
            var embed = new Discord.MessageEmbed()
            .setAuthor("Informations sur le serveur `" + message.guild.name + "`")
            .setThumbnail(message.guild.iconURL)
            .setFooter(message.guild.owner.user.tag, message.guild.owner.user.avatarURL)
            .addField("Membres", message.guild.memberCount)
            .addField("Channels", message.guild.channels.filter(chan => chan.type === "voice").size + " channels vocaux " + message.guild.channels.filter(chan => chan.type === "text").size + " channels textuels")
            .addField("Roles", message.guild.roles.map(role => role.toString()).join(" | "))
            .addField("Créateur", message.guild.owner.user.toString())
            .addField("Channel AFK", message.guild.afkChannel)
            .addField("Créer le", message.guild.createdAt)
            .addField("ID du serveur", message.guild.id)
            .addField("Region", message.guild.region)
            message.channel.send(embed)
            break;
            case "play":
            const searchString = args.slice(1).join(' ')
                    const voiceChannel = message.member.voiceChannel;
                    if (!voiceChannel) return message.channel.send("Tu dois être dans un channel vocal.");
                    const permissions = voiceChannel.permissionsFor(message.client.user)
                    if (!permissions.has('CONNECT')) {
                        return message.channel.send("Je ne peux pas rejoindre ton channel vocal.")
                    }
                    if (!permissions.has('SPEAK')) {
                        return message.channel.send("Je n'ai pas les permissions pour parler dans ton channel vocal.")
                    }
    
                    try {
                        var video = await youtube.getVideo(url);
                    } catch (error) {
                        try {
                            var videos = await youtube.searchVideos(searchString, 1);
                            var video = await youtube.getVideoByID(videos[0].id);
                        } catch (err) {
                            console.error(err)
                            return message.channel.send("Je ne parvient pas à trouver cela.");
                        }
                    }
                    console.log(video);
                    const song = {
                        id: video.id,
                        title: video.title,
                        url: `https://www.youtube.com/watch?v=${video.id}`,
                        thumbnail: `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,
                    };
                    if (!serverQueue) {
                        const queueConstruct = {
                            textChannel: message.channel,
                            voiceChannel: voiceChannel,
                            connection: null,
                            songs: [],
                            volume: 5,
                            playing: true
                        };
                        queue.set(message.guild.id, queueConstruct);
    
                        queueConstruct.songs.push(song);
    
                        try {
                            var connection = await voiceChannel.join();
                            queueConstruct.connection = connection;
                            play(message.guild, queueConstruct.songs[0]);
                        } catch (error) {
                            console.error(`Je ne peux pas rejoindre le channel vocal : ${error}`)
                            queue.delete(message.guild.id);
                            return message.channel.send(`Je ne peux pas rejoindre le channel vocal : ${error}`)
                        }
                    } else {
                        serverQueue.songs.push(song);
                        console.log(serverQueue.songs);
                        var embed = new Discord.MessageEmbed()
                        .addField("Musique ajoutée à la queue :", `[${song.title}](${song.url}) | ${song.author}`)
                        .setTimestamp()
                        .setImage(song.thumbnail)
                        .setColor("0x0000ff")
                        .setFooter(`Suggésté par : ${message.author.username}`)
                        serverQueue.textChannel.send(embed)
                    }
            break;
        case "stop":
            if (!message.member.voiceChannel) return message.channel.send("Tu dois être dans un channel vocal pour faire cette commande.")
            if (!serverQueue) return message.channel.send("Rien n'est entrain d'être jouer alors je ne peux pas stop de son(s) !")
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        break;
        case "skip":
        if (!message.member.voiceChannel) return message.channel.send("Tu dois être dans un channel vocal pour faire cette commande.")
                if (!serverQueue) return message.channel.send("Rien n'est entrain d'être jouer alors je ne peux pas skip de son !")
                    serverQueue.connection.dispatcher.end();
        break;
        case "np":
        if (!serverQueue) return message.channel.send("Rien n'est entrain d'être jouer")
        return message.channel.send(`Entrain d'être joué : **${serverQueue.songs[0].title}**`);
        break;
        case "volume":
            if (!message.member.voiceChannel) return message.channel.send("Tu dois être dans un channel vocal pour faire cette commande.")
            if (!serverQueue) return message.channel.send("Rien n'est entrain d'être joué.")
            if (!args[1]) return message.channel.send("Le volume courent est : **" + serverQueue.volume + "**");
            serverQueue.volume = args[1];
            serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
            return message.channel.send(`J'ai changer le volume pour : **${args[1]}**`)
        break;
        case "queue":
            if (!serverQueue) return message.channel.send("Rien n'est entrain d'être joué.");
            var embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .addField("Sons : ", `${serverQueue.songs.map(song => `**-** [${song.title}](${song.url})`).join('\n')}`)
        .addField("Maintenant jouée :", `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
        .setColor(generateHex())
        message.channel.send(embed)
        break;
        case "pause":
            if (serverQueue && serverQueue.playing) {
                serverQueue.playing = false;
                serverQueue.connection.dispatcher.pause();
                return message.channel.send("J'ai mis la music en pause !")
            }
            return message.channel.send("Rien n'est entrain d'être jouer.")
        break;
        case "unpause":
            if (serverQueue && !serverQueue.playing) {
                serverQueue.playing = true;
                serverQueue.connection.dispatcher.resume();
                return message.channel.send("Musique relancée !")
            }
            return message.channel.send("Rien n'est entrain d'être jouer.")
        break;
        case "eval":
        if(message.author.id !== "176041361714184193") return;
        var args = message.content.split(" ").slice(1);        
          function clean(text) {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
          }
        try {
          const code = args.join(" ");
          let evaled = eval(code);
    
          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
    
          message.channel.send(clean(evaled), {code:"xl"});
        } catch (err) {
          message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
        break;
        case "chat":
        const { body } = await superagent
        .get('http://random.cat/meow')
        var embed = new Discord.MessageEmbed()
        .setColor(generateHex())
        .setTitle("Meow :cat:")
        .setImage(body.file)
        message.channel.send(embed)
        break;
        case "config":
        let channel
        let dmText
        let joinText
        let leaveText
    
        // First, we need to fetch the message channel
        db.fetchObject(`messageChannel_${message.guild.id}`).then(channelIDFetched => {
    
            // Verify Arguments - If the text is blank, that means it hasn't been defined yet.
            if (!message.guild.channels.get(channelIDFetched.text)) channel = '*none*'
            else channel = message.guild.channels.get(channelIDFetched.text)
            // What is happening here is that it is trying to see if the CHANNEL ID stored in channelIDFetched.text is a valid channel in the guild, if not it sets channel to none, if it is it sets channel to the channel
    
            // Next, we can fetch the Join DM Text
            db.fetchObject(`joinMessageDM_${message.guild.id}`).then(joinDMFetched => {
    
                // Verify Arguments - The same thing is happening here as the last verification. This time it's just checking it joinedDMFetched.text is empty
                if (!joinDMFetched.text) dmText = "*Pas de message de bienvenue en MP.*"
                else dmText = joinDMFetched.text
    
                // Now, we want to fetch the join text for the server - accidently put a comma instead of a period there, make sure you don't do that.
                db.fetchObject(`joinMessage_${message.guild.id}`).then(joinTextFetched => {
    
                    // Verify Arguments - Same thing as the last one.
                    if (!joinTextFetched.text) joinText = "*Pas de message de bienvenue.*"
                    else joinText = joinTextFetched.text
    
                    // Finally, we can fetch the message thats sent when someone leaves
                    db.fetchObject(`leaveMessage_${message.guild.id}`).then(leaveTextFetched => {
    
                        // Verify Arguments - Same thing as the last one.
                        if (!leaveTextFetched.text) leaveText = "*Pas de message d'aurevoir.*"
                        else leaveText = leaveTextFetched.text
    
                        // Make sure that all of the fetchObjects are nested inside eachother, or else it might lock the database if it's doing it all at the same time.
                        // Now, lets form a response from all the data we collected.
                        let response = `**Channel de bienvenue & aurevoir**\n > ${channel}\n\n` // This is the first line, make sure to use \n for new lines
                        response += `**Message de bienvenue en MP**\n > ${dmText}\n\n` // Make sure you are using += not = when adding to the string.
                        response += `**Message de bienvenue**\n > ${joinText}\n\n` // This is the third line.
                        response += `**Message d'aurevoir**\n > ${leaveText}\n\n` // Now, lets send the embed using the new function we made earlier.
    
                        message.channel.send(response) // Lets test it now.
    
                    })
    
    
                })
    
            })
    
        })
    
        break;
        case "setchannel":
        if (!message.member.roles.find('name', 'FONDA')) return message.channel.send('**Tu as besoin du role Administrateur pour faire cette commande !**') // This returns if it CANT find the owner role on them. It then uses the function to send to message.channel, and deletes the message after 120000 milliseconds (2minutes)
        if (!message.mentions.channels.first() && args.join(" ").toUpperCase() !== 'NONE') return message.channel.send('**Tu as oublié de mettre un channel !**\n > *+setchannel <#channel>*') // This returns if they don't message a channel, but we also want it to continue running if they want to disable the log
    
        // Fetch the new channel they mentioned
        let newChannel;
        if (args.join(" ").toUpperCase() === 'NONE') newChannel = ''; // If they wrote the word none, it sets newChannel as empty.
        else newChannel = message.mentions.channels.first().id; // If they actually mentioned a channel, it will set newChannel as that.
    
        // Update Channel
        db.updateText(`messageChannel_${message.guild.id}`, newChannel).then(i => {
            message.channel.send(`**J'ai bien changé le channel pour les bienvenues et les aurevoirs pour: ${message.mentions.channels.first()}**`) // Finally, send in chat that they updated the channel.
        })    
        break;
        case "setdm":
            // Return Statements
    if (!message.member.roles.find('name', 'FONDA')) return message.channel.send('**Tu as besoin du role Administrateur pour faire cette commande !**') // This returns if it CANT find the owner role on them. It then uses the function to send to message.channel, and deletes the message after 120000 milliseconds (2minutes)
    if (!args2.join(" ") && args.join(" ").toUpperCase() !== 'NONE') return message.channel.send('**Tu as oublié de mettre un message !**\n > *+setdm <message>*') // This returns if they don't message a channel, but we also want it to continue running if they want to disable the log
    // ^^^ This returns if they didnt type any dedscription

    // Fetch the new channel they mentioned
    let newMessage;
    if (args2.join(" ").toUpperCase() === 'NONE') newMessage = ''; // If they wrote the word none, it sets newMessage as empty.
    else newMessage = args2.join(" ").trim(); // If they didn't write none, set what they wrote as the message

    // This will update the .text of the joinMessageDM_guildID object.
    db.updateText(`joinMessageDM_${message.guild.id}`, newMessage).then(i => {
        message.channel.send(`**J'ai bien changé le message de bienvenue en MP pour:**\n > *${args2.join(" ").trim()}*`) // Finally, send in chat that they updated the channel.
    })
        break;
        case "setwelcome":
    // Return Statements
    if (!message.member.roles.find('name', 'FONDA')) return message.channel.send('**Tu as besoin du role Administrateur pour faire cette commande !**') // This returns if it CANT find the owner role on them. It then uses the function to send to message.channel, and deletes the message after 120000 milliseconds (2minutes)
    if (!args2.join(" ") && args2.join(" ").toUpperCase() !== 'NONE') return message.channel.send('**Tu as oublié de mettre un message !**\n > *+setwelcome <message>*') // This returns if they don't message a channel, but we also want it to continue running if they want to disable the log

    let newMessage2;
    // Fetch the new channel they mentioned
    if (args2.join(" ").toUpperCase() === 'NONE') newMessage2 = ''; // If they wrote the word none, it sets newMessage as empty.
    else newMessage2 = args2.join(" ").trim(); // If they didn't write none, set what they wrote as the message

    // This will update the .text of the joinMessageDM_guildID object.
    db.updateText(`joinMessage_${message.guild.id}`, newMessage2).then(i => {
        message.channel.send(`**J'ai bien changé le message de bienvenue pour:**\n > *${args2.join(" ").trim()}*`) // Finally, send in chat that they updated the channel.
    })
        break;
        case "setleave":
    // Return Statements
    if (!message.member.roles.find('name', 'FONDA')) return message.channel.send('**Tu as besoin du role Administrateur pour faire cette commande !**') // This returns if it CANT find the owner role on them. It then uses the function to send to message.channel, and deletes the message after 120000 milliseconds (2minutes)
    if (!args2.join(" ") && args.join(" ").toUpperCase() !== 'NONE') return message.channel.send('**Tu as oublié de mettre un message !**\n > *+setleave <message>*') // This returns if they don't message a channel, but we also want it to continue running if they want to disable the log

    // Fetch the new channel they mentioned
    let newMessage3;
    if (args2.join(" ").toUpperCase() === 'NONE') newMessage3 = ''; // If they wrote the word none, it sets newMessage as empty.
    else newMessage3 = args2.join(" ").trim(); // If they didn't write none, set what they wrote as the message

    // This will update the .text of the joinMessageDM_guildID object.
    db.updateText(`leaveMessage_${message.guild.id}`, newMessage3).then(i => {
        message.channel.send(`**J'ai bien changé le message d'aurevoir pour:**\n > *${args2.join(" ").trim()}*`) // Finally, send in chat that they updated the channel.
    })

        break;
        case "setautorole":
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Tu as besoin de la permission `Administrator` pour faire cette commande !') // Tell them that they dont have the proper perms
        if (!args2.join(" ")) return message.channel.send('Merci de mettre un grade `+setautorole <nom du role>`') // Tell them if they didn't supply arguments
    
        db.updateText(`autoRole_${message.guild.id}`, args2.join(" ").trim()).then(i => { // .trim() removes the whitespaces on both ends of the string. 
    
            message.channel.send('AutoRole changé pour : `' + i.text + '`'); // This tells them what they just set the autorole to.
    
        })
        break;
        case "stats":
        if (!args2.join(" ")) return message.channel.send("Merci de spécifié un nom de joueur.")
        var playerName = args2.join(" ");
        var options = {
            method: "GET",
            url: `https://fortnite.y3n.co/v2/player/${playerName}`,
            headers: {
              'User-Agent': 'nodejs request',
              'X-Key': "aFHHPJr6K2de8pAIARnJ"
            }
          }
          request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
              var stats = JSON.parse(body);
              message.channel.send(`Stats de **${playerName}** :

__**General**__

KD : ${stats.br.stats.pc.all.kpd}
Wins : ${stats.br.stats.pc.all.wins}
Kills : ${stats.br.stats.pc.all.kills}
Matches : ${stats.br.stats.pc.all.matchesPlayed}
Pourcentage de wins : ${stats.br.stats.pc.all.winRate}
Minutes Jouée : ${stats.br.stats.pc.all.minutesPlayed}

__**Solo**__

KD : ${stats.br.stats.pc.solo.kpd}
Wins : ${stats.br.stats.pc.solo.wins}
Kills : ${stats.br.stats.pc.solo.kills}
Matches : ${stats.br.stats.pc.solo.matchesPlayed}
Pourcentage de wins : ${stats.br.stats.pc.solo.winRate}
Dernier matche : ${stats.br.stats.pc.solo.lastMatch}
Minutes Jouée : ${stats.br.stats.pc.solo.minutesPlayed}

__**Duo**__

KD : ${stats.br.stats.pc.duo.kpd}
Wins : ${stats.br.stats.pc.duo.wins}
Kills : ${stats.br.stats.pc.duo.kills}
Matches : ${stats.br.stats.pc.duo.matchesPlayed}
Pourcentage de wins : ${stats.br.stats.pc.duo.winRate}
Dernier matche : ${stats.br.stats.pc.duo.lastMatch}
Minutes Jouée : ${stats.br.stats.pc.duo.minutesPlayed}

__**Section**__

KD : ${stats.br.stats.pc.squad.kpd}
Wins : ${stats.br.stats.pc.squad.wins}
Kills : ${stats.br.stats.pc.squad.kills}
Matches : ${stats.br.stats.pc.squad.matchesPlayed}
Pourcentage de wins : ${stats.br.stats.pc.squad.winRate}
Dernier matche : ${stats.br.stats.pc.squad.lastMatch}
Minutes Jouée : ${stats.br.stats.pc.squad.minutesPlayed}
              `)   
            }
          })   
        break;
            default:
            message.channel.send("Commande invalide ^^")
    }
});

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.playStream(YTDL(song.url))
    .on('end', () => {
        console.log("Le son est fini !");
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    })
    .on('error', error => console.error(error));
dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

var embed = new Discord.MessageEmbed()
.setTimestamp()
.addField("Musique jouée :", `[${song.title}](${song.url})`)
.setImage(song.thumbnail)
.setColor("0x00ff00")
serverQueue.textChannel.send(embed)
}

bot.login(process.env.TOKEN);
