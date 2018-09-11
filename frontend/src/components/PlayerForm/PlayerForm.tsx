import * as React from 'react';
import './PlayerForm.css';

export class PlayerForm extends React.Component<IStateProps & IDispatchProps, IPlayerFormState> {
    state = {
        newPlayer: {
            name: '',
            avatarUrl: '',
            authKeys: {
                github: null,
                facebook: null,
                google: null,
                vk: null,
            },
        },
    };

    private changePlayerNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            newPlayer: {
                name: e.target.value,
            },
        });
    };

    private signUpWithGoogleHandler = () => {
        // todo: dispatch AC signUpWithGoogle
    };

    private signUpWithFacebookHandler = () => {
        // todo: dispatch AC signUpWithFacebook
    };

    private signUpWithVkHandler = () => {
        // todo: dispatch AC signUpWithVk
    };

    public render() {
        return (
            <div className="player-form">
                <div className="player-name">
                    <input type="text" name="player-name" onChange={this.changePlayerNameHandler} />
                </div>
                <div className="google-sign-up">
                    <span onClick={this.signUpWithGoogleHandler}>google</span>
                </div>
                <div className="facebook-sign-up">
                    <a href="/v1/auth/facebook">facebook a.href</a>
                </div>
                <div className="facebook-sign-up">
                    <span onClick={this.signUpWithFacebookHandler}>facebook</span>
                </div>
                <div className="vk-sign-up">
                    <span onClick={this.signUpWithFacebookHandler}>vk</span>
                </div>
            </div>
        );
    }
}

interface IStateProps {}

interface IDispatchProps {}

interface IPlayerFormState {}
