import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DomHandler from '../utils/DomHandler';

export class OverlayPanel extends Component {
    
    static defaultProps = {
        id: null,
        dismissable: true,
        showCloseIcon: false,
        style: null,
        className: null,
        appendTo: null
    }

    static propTypes = {
        id: PropTypes.string,
        dismissable: PropTypes.bool,
        showCloseIcon: PropTypes.bool,
        style: PropTypes.object,
        className: PropTypes.string,
        appendTo: PropTypes.any
    }

    constructor(props) {
        super(props);
        this.onPanelClick = this.onPanelClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
    }

    componentDidMount() {
        if(this.props.appendTo) {
            if(this.props.appendTo === 'body')
                document.body.appendChild(this.panel);
            else
                DomHandler.appendChild(this.panel, this.props.appendTo);
        }
    }
    
    bindDocumentClickListener() {
        if(!this.documentClickListener) {
            this.documentClickListener = this.onDocumentClick.bind(this);
            document.addEventListener('click', this.documentClickListener);
        }
    }
    
    unbindDocumentClickListener() {
        if(this.documentClickListener) {
            document.removeEventListener('click', this.documentClickListener);
            this.documentClickListener = null;
        }
    }

    componentWillUnmount() {
        this.unbindDocumentClickListener();
    }

    onDocumentClick() {
        if(!this.selfClick && !this.targetEvent) {
            this.hide();
        }
        
        this.selfClick = false;
        this.targetEvent = false;
    }

    onPanelClick() {
        if(this.props.dismissable) {
            this.selfClick = true;
        }
    }

    onCloseClick(event) {
        this.hide();
        
        if(this.dismissable) {
            this.selfClick = true;
        }
        
        event.preventDefault();
    }

    toggle(event, target) {
        let currentTarget = (target||event.currentTarget||event.target);
                                
        if(this.isVisible())
            this.hide();
        else
            this.show(event, currentTarget);
    }

    show(event, target) {
        if(this.props.dismissable) {
            if(this.documentClickListener) {
                this.targetEvent = true;
            }
            
            this.bindDocumentClickListener();
        }
        
        this.container.style.zIndex = DomHandler.getZindex();

        if(this.isVisible()) {
            DomHandler.absolutePosition(this.container, target);
        }
        else {
            this.container.style.display = 'block';
            DomHandler.absolutePosition(this.container, target);
            DomHandler.fadeIn(this.container, 250);
        }
    }

    hide() {
        if(this.isVisible()) {
            this.container.style.display = 'none';
            this.unbindDocumentClickListener();
        }
    }

    isVisible() {
        return this.container.offsetParent;
    }

    render() {
        let className = classNames('ui-overlaypanel ui-widget ui-widget-content ui-corner-all ui-shadow', this.props.className);
        let closeIcon;
        
        if(this.props.showCloseIcon) {
            closeIcon = <a href="#" className="ui-overlaypanel-close ui-state-default" onClick={this.onCloseClick}>
                            <span className="fa fa-fw fa-close"></span>
                        </a>;
        }

        return (
            <div id={this.props.id} className={className} style={this.props.style} 
                onClick={this.onPanelClick} ref={(el) => {this.container = el}}>
                <div className="ui-overlaypanel-content">
                    {this.props.children}
                </div>
                {closeIcon}
            </div>
        );
    }
}