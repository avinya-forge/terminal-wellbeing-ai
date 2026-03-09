import { render } from "@testing-library/react"
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "./toast"

describe("toast component", () => {
  it("renders ToastProvider and Viewport", () => {
    const { container } = render(
      <ToastProvider>
        <ToastViewport className="test-viewport" />
      </ToastProvider>
    )
    expect(container.querySelector('.test-viewport')).toBeInTheDocument()
  })

  it("renders default Toast", () => {
    const { container } = render(
      <ToastProvider>
        <Toast className="test-toast" />
        <ToastViewport />
      </ToastProvider>
    )
    const toast = container.querySelector('.test-toast')
    expect(toast).toBeInTheDocument()
    // Should have default variant classes
    expect(toast?.className).toContain('bg-background')
  })

  it("renders destructive Toast", () => {
    const { container } = render(
      <ToastProvider>
        <Toast className="test-toast" variant="destructive" />
        <ToastViewport />
      </ToastProvider>
    )
    const toast = container.querySelector('.test-toast')
    expect(toast).toBeInTheDocument()
    expect(toast?.className).toContain('bg-destructive')
  })

  it("renders ToastAction", () => {
    const { getByText } = render(
      <ToastProvider>
        <Toast>
          <ToastAction altText="Try again">Action</ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )
    expect(getByText('Action')).toBeInTheDocument()
  })

  it("renders ToastClose", () => {
    const { container } = render(
      <ToastProvider>
        <Toast>
          <ToastClose className="test-close" />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )
    expect(container.querySelector('.test-close')).toBeInTheDocument()
  })

  it("renders ToastTitle and ToastDescription", () => {
    const { getByText } = render(
      <ToastProvider>
        <Toast>
          <ToastTitle>My Title</ToastTitle>
          <ToastDescription>My Description</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )
    expect(getByText('My Title')).toBeInTheDocument()
    expect(getByText('My Description')).toBeInTheDocument()
  })
})
