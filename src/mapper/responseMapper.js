
const mapLoginData = ({USER_ID, ROLE, USERNAME}) => {
    return {id: USER_ID, role: ROLE.toLowerCase(), username: USERNAME};
};

const responseMapper = {
    mapLoginData: mapLoginData
};

export default responseMapper;