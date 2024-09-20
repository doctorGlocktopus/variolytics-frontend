import React, {
    Component, Fragment,
} from "react";
import styles from "../../styles/Blog.module.css";


class Autocomplete extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: "",
        };
    }

    onChange = e => {
        const { suggestions } = this.props;
        const userInput = e.currentTarget.value;

        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: suggestions || [],
            showSuggestions: true,
            userInput: e.currentTarget.value
        });
        this.props.onChange(e.currentTarget.value);
    };

    onClick = e => {
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.value
        });
    };

    onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions } = this.state;

        if (e.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion]
            });
        } else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }
            this.setState({ activeSuggestion: activeSuggestion - 1 });
        }

        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }
            this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
    };

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                userInput
            }
        } = this;

        let suggestionsListComponent;
        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                suggestionsListComponent = (
                    <div className="suggestions">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;

                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                            }
                            return (
                                <div  className={styles.sugg}  key={"suggestion-" + index} onClick={onClick}>
                                    {suggestion}
                                </div>
                            );
                        })}
                    </div>
                );
            } else {
                suggestionsListComponent = (
                    <div class="no-suggestions">
                        <div className={styles.sugg} >
                            Kein Beitrag gefunden
                        </div>
                    </div>
                );
            }
        }

        return (
            <Fragment>
                <div className={styles.relative}>
                    <div className={styles.lense}>
                        &#x1F50E;&#xFE0E;
                    </div>
                    <input
                        type="search"
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        className={styles.searchBox}
                        value={userInput}
                    />
                    {suggestionsListComponent}
                </div>
            </Fragment>
        );
    }
}

export default Autocomplete;