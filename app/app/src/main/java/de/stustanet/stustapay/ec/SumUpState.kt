package de.stustanet.stustapay.ec

import com.sumup.merchant.reader.models.TransactionInfo

sealed interface SumUpState {
    fun msg(): String

    object None : SumUpState {
        override fun msg(): String {
            return "idle"
        }
    }

    data class Started(
        val transactionId: String
    ) : SumUpState {
        override fun msg(): String {
            return "transaction started: $transactionId"
        }
    }

    data class Failed(
        val msg: String
    ) : SumUpState {
        override fun msg(): String {
            return "transaction failed: $msg"
        }
    }

    data class Success(
        val msg: String,
        val txCode: String,
        val txInfo: TransactionInfo?,
    ) : SumUpState {
        override fun msg(): String {
            return "transaction success: $msg"
        }
    }

    data class Error(
        val msg: String
    ) : SumUpState {
        override fun msg(): String {
            return "transaction error: $msg"
        }
    }
}
