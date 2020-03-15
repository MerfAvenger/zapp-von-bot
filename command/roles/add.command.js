module.exports = function(client, message, params) {
    const [
        targetUserId,
        targetRoleAsString
    ] = params;

    const targetUser = getTargetUser(targetUserId, message, client);
    const targetRole = getTargetRoleAsObject(targetRoleAsString, message);

    message.reply(`I'm adding the role ${targetRoleAsString} to user ${targetUserId}.`);

    targetUser.addRole(targetRole);
}

const getTargetRoleAsObject = function(roleAsString, message) {
    const targetRole = message.guild.roles.find((role) => {
        return role.name === roleAsString ? role : null;
    });

    if(!targetRole) {
        throw new Error(`Role '${role}' was not found.`)
    }

    return targetRole;
}

const getTargetUser = function(uuid, message, client) {
    const user = getUser(uuid, client);

    const guildUser = message.guild.member(user);

    if(!user || !guildUser) {
        if(!user) {
            throw new Error(`User '${uuid}' was not found.`)
        } else {
            throw new Error(`User '${uuid}' was not found on the server '${message.guild.name}'.`);
        }
    }

    return guildUser
}

const getUser = function(userId, client) {
    const deconst = userId.split("#");
    let rtn = {};

    const [
        name,
        discriminator
    ] = deconst;
    
    client.users.find((user) => {
        if(user.username === name && user.discriminator === discriminator) {
            rtn = user;
        }
    })

    return rtn;
}