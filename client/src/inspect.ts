import { installCopyEventListeners } from "./copyable.ts"
import { installNavbarListeners } from "./navbar.ts"
import { evaluateTimeElements } from "./time.ts"

evaluateTimeElements()
installCopyEventListeners()
installNavbarListeners()