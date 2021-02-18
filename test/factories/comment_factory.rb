FactoryGirl.define do
  factory :comment do
    card
    text { FFaker::Lorem.paragraph }
  end
end
