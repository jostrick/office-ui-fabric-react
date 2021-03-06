import * as React from 'react';
import {
  BaseComponent,
  autobind,
  css,
  getId,
  buttonProperties,
  getNativeProps
} from '../../Utilities';
import { IToggleProps, IToggle } from './Toggle.Props';
import { Label } from '../../Label';
import * as stylesImport from './Toggle.scss';
const styles: any = stylesImport;

export interface IToggleState {
  isChecked: boolean;
}

export class Toggle extends BaseComponent<IToggleProps, IToggleState> implements IToggle {

  private _id: string;
  private _toggleButton: HTMLButtonElement;

  constructor(props: IToggleProps) {
    super();

    this._warnMutuallyExclusive({
      checked: 'defaultChecked'
    });

    this.state = {
      isChecked: !!(props.checked || props.defaultChecked)
    };
    this._id = props.id || getId('Toggle');
  }

  /**
   * Gets the current checked state of the toggle.
   */
  public get checked(): boolean {
    return this.state.isChecked;
  }

  public componentWillReceiveProps(newProps: IToggleProps) {
    if (newProps.checked !== undefined) {
      this.setState({
        isChecked: newProps.checked
      });
    }
  }

  public render() {
    let { label, onAriaLabel, offAriaLabel, onText, offText, className, disabled } = this.props;
    let { isChecked } = this.state;
    let stateText = isChecked ? onText : offText;
    const ariaLabel = isChecked ? onAriaLabel : offAriaLabel;
    const toggleNativeProps = getNativeProps(this.props, buttonProperties);
    return (
      <div className={
        css(
          styles.root,
          'ms-Toggle',
          className,
          {
            'is-checked': isChecked,
            'is-enabled': !disabled,
            'is-disabled': disabled,
            [styles.isChecked]: isChecked,
            [styles.isEnabled]: !disabled,
            [styles.isDisabled]: disabled,
          }
        ) }>
        <div className={ css(styles.innerContainer, 'ms-Toggle-innerContainer') }>
          { label && (
            <Label className='ms-Toggle-label' htmlFor={ this._id }>{ label }</Label>
          ) }
          <div className={ css(styles.slider, 'ms-Toggle-slider') }>
            <button
              ref={ (c): HTMLButtonElement => this._toggleButton = c }
              type='button'
              id={ this._id }
              { ...toggleNativeProps }
              name={ this._id }
              className={ css(styles.button, 'ms-Toggle-button') }
              disabled={ disabled }
              aria-pressed={ isChecked }
              aria-label={ ariaLabel }
              onClick={ this._onClick }
            />
            <div className={ css(styles.background, 'ms-Toggle-background') }>
              <div className={ css(styles.focus, 'ms-Toggle-focus') } />
              <div className={ css(styles.thumb, 'ms-Toggle-thumb') } />
            </div>
            { stateText && (
              <Label className={ css(styles.stateText, 'ms-Toggle-stateText') }>{ stateText }</Label>
            ) }
          </div>
        </div>
      </div>
    );
  }

  public focus() {
    if (this._toggleButton) {
      this._toggleButton.focus();
    }
  }

  @autobind
  private _onClick() {
    let { checked, onChanged } = this.props;
    let { isChecked } = this.state;

    // Only update the state if the user hasn't provided it.
    if (checked === undefined) {
      this.setState({
        isChecked: !isChecked
      });
    }

    if (onChanged) {
      onChanged(!isChecked);
    }
  }
}
