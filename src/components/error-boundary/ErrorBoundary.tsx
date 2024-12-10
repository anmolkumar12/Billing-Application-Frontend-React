import React, { Component, ErrorInfo, ReactNode } from 'react'

/**
 * ErrorBoundary will ensure that something is rendered in your react application
 * if any of the child components within it throws an unexpected error.
 * The `render` prop expects a function that returns a React Element to
 * display in the event of an error. It is passed the error.
 *
 * NOTE: This is only a 'class component' because there is currently no functional
 * equivalent for componentDidCatch.
 */

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  errorMessage: any
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true, errorMessage: error })
  }

  public render() {
    if (this.state.hasError) {
      return <h1>{this.state.errorMessage}</h1>
    }

    return this.props.children
  }
}
