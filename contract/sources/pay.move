module payment::new_payment {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    
    // Error codes
    const EINVALID_PAYMENT_AMOUNT: u64 = 1;

    // Required payment amount in octas (0.2 APT = 20000000 octas)
    const REQUIRED_PAYMENT: u64 = 20000000;

    // Struct to track payments with a counter
    struct PaymentRecord has key {
        num_payments: u64
    }

    // Function to receive payment - handles initialization automatically
    public entry fun receive_payment(
        sender: &signer,
        amount: u64
    ) acquires PaymentRecord {
        let sender_addr = signer::address_of(sender);
        
        // Verify payment amount
        assert!(amount == REQUIRED_PAYMENT, EINVALID_PAYMENT_AMOUNT);
        
        // If payment record doesn't exist, create it
        if (!exists<PaymentRecord>(sender_addr)) {
            move_to(sender, PaymentRecord {
                num_payments: 0
            });
        };
        
        // Get payment record and increment counter
        let payment_record = borrow_global_mut<PaymentRecord>(sender_addr);
        
        // Transfer APT from sender to module account
        let module_addr = @payment;
        coin::transfer<AptosCoin>(sender, module_addr, REQUIRED_PAYMENT);
        
        // Increment payment counter
        payment_record.num_payments = payment_record.num_payments + 1;
    }

    // Get number of payments made by an address
    public fun get_payment_count(addr: address): u64 acquires PaymentRecord {
        if (!exists<PaymentRecord>(addr)) {
            return 0
        };
        borrow_global<PaymentRecord>(addr).num_payments
    }

    // Check if an address has made at least one payment
    public fun has_paid(addr: address): bool acquires PaymentRecord {
        if (!exists<PaymentRecord>(addr)) {
            return false
        };
        borrow_global<PaymentRecord>(addr).num_payments > 0
    }

    // Get the required payment amount
    public fun get_required_payment(): u64 {
        REQUIRED_PAYMENT
    }
}