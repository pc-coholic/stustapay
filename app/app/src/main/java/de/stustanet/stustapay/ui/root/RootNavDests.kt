package de.stustanet.stustapay.ui.root

import de.stustanet.stustapay.ui.nav.NavDest
import de.stustanet.stustapay.ui.nav.NavDestinations


/** root views (opened by navigation drawer) */
object RootNavDests : NavDestinations() {
    val startpage = NavDest("startpage")
    val ticket = NavDest("ticket", showSystemUI = false)
    val sale = NavDest("sale", showSystemUI = false)
    val topup = NavDest("topup", showSystemUI = false)
    val status = NavDest("status")
    val user = NavDest("user")
    val settings = NavDest("settings")
    val development = NavDest("development")
    val history = NavDest("history")
    val rewards = NavDest("rewards")
    val cashierManagement = NavDest("cashierManagement")
    val cashierStatus = NavDest("cashierStatus")
}
