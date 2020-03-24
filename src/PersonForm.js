import React, {Fragment} from 'react';
import userService from "./service/UserService";

class PersonForm extends React.Component {
    constructor(props) {
        super(props);
        let submitLabel;

        switch(props.mode) {
            case 'new':
                submitLabel = 'Add ';
                break;
            case 'edit':
                submitLabel = 'Edit ';
                break;
            default:
                break;
        }
        switch(props.type) {
            case 'rider':
                submitLabel += 'Rider';
                break;
            case 'ridee':
                submitLabel += 'Ridee';
                break;
            default:
                break;
        }
        this.state = {
            data: {
                name: '',
                tel: '',
                address: '',
                small_group: '',
                kakao: '',
                location: '',
                leader: '',
                birthday: ''
            },
            submitLabel: submitLabel
        };

        this.addressAutocomplete = null;
        this.handleAddressSelect = this.handleAddressSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (this.props.mode === 'edit') {
            if (this.props.type === 'rider') {
                var riderID = this.props.id;
                userService.getRider(riderID).then(rider => {
                    this.mapPersonData(rider.data)
                })
            }
            else if (this.props.type === 'ridee') {
                var rideeID = this.props.id;
                userService.getRidee(rideeID).then(ridee => {
                    this.mapPersonData(ridee.data)
                })
            }
        }

        this.loadGoogleAPI()
    }

    loadGoogleAPI() {
        const googleMapsScript = document.createElement('script');
        const addressField = document.getElementById('address');
        const initiateAutocomplete = () => {
            this.addressAutocomplete = new window.google.maps.places.Autocomplete(addressField, {types: ['address']});
            this.addressAutocomplete.setFields(['formatted_address']);
            this.addressAutocomplete.addListener("place_changed", this.handleAddressSelect);
        };

        googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
        window.document.body.appendChild(googleMapsScript);

        googleMapsScript.addEventListener('load', initiateAutocomplete)
    }

    handleAddressSelect() {
        const place = this.addressAutocomplete.getPlace();
        this.setState({
            data: {
                ...this.state.data,
                address: place.formatted_address
            }
        })
    }

    handleSubmit(event) {
        if (this.props.mode === 'edit') {
            if (this.props.type === 'rider') userService.editRider(this.props.id, this.state.data);
            if (this.props.type === 'ridee') userService.editRidee(this.props.id, this.state.data);
        }
        else if (this.props.mode === 'new') {
            if (this.props.type === 'rider') {
                userService.addRider(this.state.data).then(res => alert(res));
                    // .then(this.props.history.push('/riders'));
            }
            if (this.props.type === 'ridee') {
                userService.addRidee(this.state.data).then(this.props.history.push('/ridees'));
            }
        }
    }

    handleChange(event) {
        let value = event.target.value;
        const name = event.target.name;
        if (name === 'tel') {
            value = this.formatPhoneNumber(value, this.state.data['tel']);
        }

        this.setState({
            data: {
                ...this.state.data,
                [name]: value
            }
        });
    }

    formatPhoneNumber(currTel, prevTel) {
        const tel = currTel.replace(/[^\d]/g, '');
        if(!tel) return tel;

        if (!prevTel || tel.length > prevTel.length) {
            if(tel.length < 4) return tel;
            if(tel.length < 7) return `(${tel.slice(0,3)}) ${tel.slice(3)}`;
            return `(${tel.slice(0,3)}) ${tel.slice(3,6)}-${tel.slice(6, 10)}`;
        }
    }

    mapPersonData(data) {
        this.setState({
            data: {
                name: data.NAME,
                address: data.ADDRESS,
                tel: data.PHONE_NUMBER,
                small_group: data.SMALL_GROUP || '',
                kakao: data.KAKAO || '',
                location: data.LOCATION || '',
                leader: data.LEADER || '',
                birthday: data.BIRTHDAY || ''
            }
        });
    }

    render() {
        return (
            <Fragment>
            <h2>
                {this.props.mode === 'new' ? 'Add' : 'Edit'} {this.props.type === 'rider' ? 'Rider' : 'Ridee'}
            </h2>
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={this.state.data.name} onChange={this.handleChange} required />
                <label htmlFor="tel">Phone Number:</label>
                <input type="tel" name="tel" id="tel" value={this.state.data.tel} onChange={this.handleChange} required />
                <label htmlFor="address">Address:</label>
                <input type="text" name="address" id="address" value={this.state.data.address} onChange={this.handleChange} required />
                <label htmlFor="leader">Leader:</label>
                <input type="text" name="leader" id="leader" value={this.state.data.leader} onChange={this.handleChange} />
                {this.props.type === 'rider' &&
                <Fragment>
                    <label htmlFor="birthday">Birthday:</label>
                    <input type="text" name="birthday" id="birthday" value={this.state.data.birthday} onChange={this.handleChange} />
                </Fragment>}
                <label htmlFor="kakao">Kakao ID:</label>
                <input type="text" name="kakao" id="kakao" value={this.state.data.kakao} onChange={this.handleChange} />
                {this.props.type === 'ridee' &&
                <Fragment>
                    <label htmlFor="small group">Small Group:</label>
                    <input type="text" name="small group" id="small group" value={this.state.data.small_group} onChange={this.handleChange} />
                    <label htmlFor="location">Location:</label>
                    <input type="text" name="location" id="location" value={this.state.data.location} onChange={this.handleChange} />
                </Fragment>}
                <input type="submit" value={this.state.submitLabel} onClick={this.handleSubmit}/>
            </form>
            </Fragment>
        );
    }
}

export default PersonForm