package de.stustanet.stustapay.ui.account

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.Divider
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.stustanet.stustapay.R
import de.stustanet.stustapay.model.Account
import de.stustanet.stustapay.model.UserTag
import de.stustanet.stustapay.ui.common.TagItem
import de.stustanet.stustapay.ui.theme.AccountOverviewKeyStyle
import de.stustanet.stustapay.ui.theme.AccountOverviewValueBigStyle
import de.stustanet.stustapay.ui.theme.AccountOverviewValueStyle
import de.stustanet.stustapay.ui.theme.MoneyAmountStyle


@Composable
fun SummaryEntry(
    key: String,
    value: String,
    below: Boolean = false,
    small: Boolean = false,
) {
    val keySize = AccountOverviewKeyStyle
    val contentStyle = if (small) {
        AccountOverviewValueStyle
    } else {
        AccountOverviewValueBigStyle
    }

    if (below) {
        Column(
            modifier = Modifier
                .fillMaxWidth(),
            horizontalAlignment = Alignment.Start,
        ) {
            Text(
                text = key,
                style = keySize,
            )
            Text(
                text = value,
                style = contentStyle,
                modifier = Modifier.padding(start = 5.dp),
            )
        }
    } else {
        Row(
            modifier = Modifier
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Start,
        ) {
            Text(
                text = key,
                style = keySize,
                modifier = Modifier.weight(0.4f),
            )
            Text(
                text = value,
                style = contentStyle,
                modifier = Modifier.weight(0.6f),
            )
        }
    }
}


@Composable
fun AccountProperties(
    account: Account,
    showComment: Boolean,
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxWidth(),
    ) {
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                if (account.user_tag_uid != null) {
                    TagItem(
                        UserTag(account.user_tag_uid),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp)
                    )
                }

                Text(
                    text = "%.02f€".format(account.balance),
                    style = MoneyAmountStyle,
                )

                // only show if they have vouchers?
                Spacer(modifier = Modifier.height(5.dp))
                Text(
                    "${account.vouchers} ${stringResource(R.string.customer_vouchers)}",
                    fontSize = 36.sp
                )
            }
        }

        item {
            Spacer(modifier = Modifier.height(5.dp))
        }

        if (account.restriction != null) {
            item {
                Divider()
                SummaryEntry(
                    stringResource(R.string.customer_restriction),
                    when (account.restriction) {
                        "under_18" -> {
                            stringResource(R.string.under_18_years)
                        }

                        "under_16" -> {
                            stringResource(R.string.under_16_years)
                        }

                        else -> account.restriction
                    },
                )
            }
        }

        if (account.name != null) {
            item {
                Divider()
                SummaryEntry(
                    stringResource(R.string.customer_name),
                    account.name,
                )
            }
        }

        if (showComment && !account.comment.isNullOrEmpty()) {
            item {
                Divider()
                SummaryEntry(
                    stringResource(R.string.customer_comment),
                    account.comment,
                    below = true,
                    small = true,
                )
            }
        }
    }
}