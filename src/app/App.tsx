import { ModalProvider } from "./providers/ModalProvider"
import { AppRouter } from "./routes"
import { Toaster } from "sonner"
import { ThemeProvider } from "./providers/ThemeProvider"
import { WsProvider } from "./providers/WsProvider"

function App() {

  return (
    <>
      <WsProvider>
        <ThemeProvider>
          <ModalProvider>
            <AppRouter />
            <Toaster
              theme="system"
              position="bottom-right"
              richColors={false}
              toastOptions={{
                className: "app-toast",
                descriptionClassName: "app-toast__desc",
              }}
            />
          </ModalProvider>
        </ThemeProvider>
      </WsProvider>
    </>
  )
}

export default App
