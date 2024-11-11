module receiver::payment_receiver {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    
    // Error codes
    const EINVALID_PAYMENT_AMOUNT: u64 = 1;
    const EPAYMENT_ALREADY_MADE: u64 = 2;

    // Required payment amount in octas (0.2 APT = 20000000 octas)
    const REQUIRED_PAYMENT: u64 = 20000000;

    // Struct to track payments
    struct PaymentRecord has key {
        has_paid: bool
    }

    // Initialize payment record for a new account
    public entry fun initialize(account: &signer) {
        if (!exists<PaymentRecord>(signer::address_of(account))) {
            move_to(account, PaymentRecord {
                has_paid: false
            });
        }
    }

    // Function to receive payment
    public entry fun receive_payment(
        sender: &signer,
        amount: u64
    ) acquires PaymentRecord {
        let sender_addr = signer::address_of(sender);
        
        // Verify payment amount
        assert!(amount == REQUIRED_PAYMENT, EINVALID_PAYMENT_AMOUNT);
        
        // Check if payment was already made
        let payment_record = borrow_global_mut<PaymentRecord>(sender_addr);
        assert!(!payment_record.has_paid, EPAYMENT_ALREADY_MADE);
        
        // Transfer APT from sender to module account
        let module_addr = @receiver;
        coin::transfer<AptosCoin>(sender, module_addr, REQUIRED_PAYMENT);
        
        // Mark payment as complete
        payment_record.has_paid = true;
    }

    // Check if an address has paid
    public fun has_paid(addr: address): bool acquires PaymentRecord {
        if (!exists<PaymentRecord>(addr)) {
            return false
        };
        borrow_global<PaymentRecord>(addr).has_paid
    }
}